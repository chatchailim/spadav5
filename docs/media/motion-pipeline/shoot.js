const {chromium}=require('/opt/node22/lib/node_modules/playwright');const fs=require('fs');
(async()=>{const D=JSON.parse(fs.readFileSync('data.json'));const b=await chromium.launch();const p=await b.newPage({viewport:{width:1920,height:1080}});
await p.goto('file://'+process.cwd()+'/player.html');await p.evaluate(d=>init(d),D);
const a=+process.argv[2]||0,z=+process.argv[3]||Math.floor(D.T*D.fps);
fs.mkdirSync('fr',{recursive:true});
for(let f=a;f<z;f++){await p.evaluate(t=>render(t),f/D.fps);await p.screenshot({path:`fr/${String(f).padStart(5,'0')}.jpg`,type:'jpeg',quality:92});}
await b.close();console.log('rendered',a,z)})();
