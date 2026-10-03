import fs from "node:fs";
const files=["index.html","login.html","signup.html","dashboard.html","admin.html","product.html","shop.html","category.html","submit-product.html","checkout.html","supabase-client.js","supabase-config.js","supabase/schema.sql"];
for(const f of files)if(!fs.existsSync(f))throw new Error("Missing "+f);
const all=files.filter(f=>/\.(html|js)$/.test(f) && f!=="scripts/verify-static.mjs").map(f=>fs.readFileSync(f,"utf8")).join("\n").toLowerCase();
for(const bad of ["firebasejs","firebaseconfig","firestore","firebaseapp"])if(all.includes(bad))throw new Error("Firebase reference remains: "+bad);
if(!fs.existsSync("assets/tool-placeholder.svg"))throw new Error("Missing image placeholder");
console.log("Static checks passed");
