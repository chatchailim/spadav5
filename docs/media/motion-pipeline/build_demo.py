import sys,json,wave,math,subprocess
import numpy as np, imageio_ffmpeg
sys.path.insert(0,'../vid2')
from clips import C
cl=C['k'];NS=4;S=cl['scenes'][:NS];FPS=30;GAP=0.3
tl=[];cur=0;chunks=[]
for i,s in enumerate(S):
    with wave.open(f'../vid2/w_k/audio/s{i:02d}.wav') as w: a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)/32768
    act=np.where(np.abs(a)>.008)[0];a=a[max(0,act[0]-2400):min(len(a),act[-1]+3600)]
    sp=len(a)/24000;dur=math.ceil((sp+GAP)*FPS)/FPS;a=np.pad(a,(0,int(round(dur*24000))-len(a)))
    words=s['nar'].split(' ');lines=[];b=''
    for x in words:
        if len(b)+len(x)>44 and b:lines.append(b);b=x
        else:b=(b+' '+x).strip()
    if b:lines.append(b)
    tot=sum(len(l) for l in lines);c=0;sl=[]
    for l in lines:
        st=c/tot*sp;c+=len(l);sl.append([cur+st,cur+c/tot*sp,l])
    n=len(s['items']);it=[cur+0.12*dur+k*(0.55*dur/max(n,1)) for k in range(n)]
    tl.append(dict(i=i,start=cur,dur=dur,title=s['title'],kind=s['kind'],items=s['items'],itemT=it,subs=sl,ch=cl['tag']))
    chunks.append(a);cur+=dur
T=cur+1.5
full=np.concatenate(chunks);rms=np.sqrt(np.mean(full[np.abs(full)>.01]**2));full=np.clip(full*(0.158/rms),-.97,.97)
full=np.pad(full,(int(0.8*24000),int(1.5*24000)))   # 0.8s music intro before first word
for t in tl:
    t['start']+=0.8
    for k in range(len(t['itemT'])):t['itemT'][k]+=0.8
    for sb in t['subs']:sb[0]+=0.8;sb[1]+=0.8
T=len(full)/24000
with wave.open('narr.wav','wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(24000);w.writeframes((full*32767).astype(np.int16).tobytes())
subprocess.run(['python3','music.py',str(round(T,2))],check=True)
E=imageio_ffmpeg.get_ffmpeg_exe()
# duck music under narration (sidechain), then loudness normalise
subprocess.run([E,'-y','-v','error','-i','music.wav','-i','narr.wav','-filter_complex',
 "[0:a]volume=0.9[m];[1:a]aresample=44100,asplit=2[n1][n2];[m][n1]sidechaincompress=threshold=0.02:ratio=9:attack=15:release=450:makeup=1[d];[d][n2]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-1.5:LRA=11[o]",
 '-map','[o]','-ar','48000','-ac','2','mix.wav'],check=True)
# music-reactive analysis: 12 log bands per video frame from the music track
with wave.open('music.wav') as w: m=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32).reshape(-1,2).mean(1)/32768
sr=44100;nf=int(T*FPS);edges=np.geomspace(40,8000,13);bands=np.zeros((nf,12))
for f in range(nf):
    c=int(f/FPS*sr);seg=m[max(0,c-1024):c+1024]
    if len(seg)<2048:seg=np.pad(seg,(0,2048-len(seg)))
    sp_=np.abs(np.fft.rfft(seg*np.hanning(2048)));fr=np.fft.rfftfreq(2048,1/sr)
    for b in range(12):bands[f,b]=sp_[(fr>=edges[b])&(fr<edges[b+1])].sum()
bands=bands/(np.percentile(bands,98,axis=0)+1e-9);bands=np.clip(bands,0,1.2)
json.dump(dict(T=T,fps=FPS,scenes=tl,bands=np.round(bands,3).tolist(),bpm=84,tag=cl['tag']),open('data.json','w'),ensure_ascii=False)
print('T',round(T,1),'frames',nf)
