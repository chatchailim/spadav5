# Original procedural music (no third-party samples, no licensing issues)
import numpy as np, wave, json, sys
SR=44100; BPM=84; DUR=float(sys.argv[1]) if len(sys.argv)>1 else 60
spb=60/BPM; n=int(SR*DUR); t=np.arange(n)/SR
rng=np.random.default_rng(7)
def midi(m): return 440*2**((m-69)/12)
chords=[[48,55,64,67],[45,52,60,64],[41,48,57,60],[43,50,59,62]]   # C, Am, F, G (open voicings)
out=np.zeros(n)
def env_adsr(L,a,r):
    e=np.ones(L); A=int(a*SR); R=int(r*SR)
    e[:A]=np.linspace(0,1,A); e[-R:]*=np.linspace(1,0,R); return e
bar=4*spb
# pad: 2 bars per chord
for ci in range(int(DUR/(2*bar))+1):
    s=int(ci*2*bar*SR); L=int(2*bar*SR)+int(0.8*SR)
    if s>=n: break
    L=min(L,n-s); tt=np.arange(L)/SR; pad=np.zeros(L)
    for m in chords[ci%4]:
        f=midi(m)
        for det in (-0.12,0,0.12):
            ff=f*2**(det/12*0.5)
            pad+=np.sin(2*np.pi*ff*tt)+0.35*np.sin(2*np.pi*2*ff*tt)+0.12*np.sin(2*np.pi*3*ff*tt)
    pad*=env_adsr(L,1.2,1.4)*0.035
    out[s:s+L]+=pad
# arpeggio plucks (8th notes), gentle
pat=[0,2,3,2,1,2,3,2]
for k in range(int(DUR/(spb/2))):
    s=int(k*spb/2*SR)
    if s>=n: break
    ci=int(k*spb/2/(2*bar))%4; m=chords[ci][pat[k%8]]+12
    L=min(int(0.9*SR),n-s); tt=np.arange(L)/SR
    v=(np.sin(2*np.pi*midi(m)*tt)+0.3*np.sin(2*np.pi*2*midi(m)*tt))*np.exp(-tt*4.5)
    out[s:s+L]+=v*0.05*(0.7+0.3*(k%2==0))
# soft kick on beats 1 and 3, shaker on off-beats
for b in range(int(DUR/spb)):
    s=int(b*spb*SR)
    if s>=n: break
    if b%4 in (0,2):
        L=min(int(0.35*SR),n-s); tt=np.arange(L)/SR
        out[s:s+L]+=np.sin(2*np.pi*(55+70*np.exp(-tt*28))*tt)*np.exp(-tt*9)*0.22
    s2=s+int(spb/2*SR)
    if s2<n:
        L=min(int(0.06*SR),n-s2); nz=rng.standard_normal(L)
        nz=np.diff(nz,prepend=0)  # crude high-pass
        out[s2:s2+L]+=nz*np.exp(-np.arange(L)/SR*70)*0.03
# global fades, soft clip, stereo widen
out*=np.minimum(1,t/2.5)*np.minimum(1,(DUR-t)/3)
out=np.tanh(out*1.6)*0.6
d=int(0.012*SR); L=np.concatenate([out,np.zeros(d)])[:n]; R=np.concatenate([np.zeros(d),out])[:n]
st=np.stack([out*0.8+L*0.2,out*0.8+R*0.2],1)
with wave.open('music.wav','wb') as w:
    w.setnchannels(2);w.setsampwidth(2);w.setframerate(SR);w.writeframes((st*32767).astype(np.int16).tobytes())
json.dump({'bpm':BPM,'beat_s':spb,'duration':DUR},open('music.json','w'))
print('ok',DUR,'s')
