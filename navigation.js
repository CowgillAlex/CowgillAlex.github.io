function injectLinks(){
    const nav = document.getElementById("nav-head")
   
    nav.innerHTML = `
     <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/projects/scratch/minecraft/">Projects</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="https://www.youtube.com/@AlexC_MC">YouTube</a></li>
        <li><a href="https://edu.alexco.dev/">A Level</a></li>
        <li><a href="#">Posts</a></li>
        <li><a href="/IS/">IS</a></li>

      </ul>
    `
}
function injectFooter(){
    const foot = document.getElementById("footer-foot");
    foot.innerHTML = `
          &copy; 2025 Alexander Cowgill <a style="color:#fff" href="/privacy">Privacy</a><br>This site is under construction. Your page probably isn't there. Sorry!
    `
}
injectLinks();
injectFooter();