const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/E29/Arjunnn/BlogApp/Blog_FrontEnd/src').filter(f => f.endsWith('.js') || f.endsWith('.jsx'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(/http:\/\/localhost:4000/g, '${import.meta.env.VITE_BACKEND_URL}');
  newContent = newContent.replace(/(['"])(\$\{import\.meta\.env\.VITE_BACKEND_URL\}[^'"]*)\1/g, '`$2`');

  if (newContent !== content) {
    fs.writeFileSync(f, newContent);
    console.log('Updated', f);
  }
});
