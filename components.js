function createHeader() {
    const header = document.createElement('header');
    header.className = "fixed top-0 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-700 z-50";
    header.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
                <div class="flex items-center">
                    <a href="#">
                        <img class="h-8 w-auto" src="./assets/sitelogo.png" alt="Logo">
                    </a>
                </div>
                <div class="block md:hidden">
                    <button id="mobile-menu-toggle" class="text-gray-300 hover:text-white focus:outline-none focus:text-white">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
                <div class="hidden md:block">
                    <nav class="flex space-x-4">
                        <a href="/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Home</a>
                        <a href="/projects/scratch/minecraft/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Scratch</a>
                        <a href="/contact" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Contact</a>
                        <a href="/IS/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">IS</a>
                    </nav>
                </div>
            </div>
        </div>
    `;
    return header;
}
function mobileMenu(){
    const menu = document.createElement('div')
    menu.className = "hidden md:hidden fixed top-16 left-0 right-0 bg-gradient-to-r from-gray-900 to-gray-700 z-50"
    menu.innerHTML = `
    <nav class="px-2 pt-2 pb-4 space-y-1">
      <a href="/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Home</a>
            <a href="/projects/scratch/minecraft/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Scratch</a>
            <a href="/contact" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">Contact</a>
            <a href="IS/" class="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700">IS</a>
          </nav>
    `
    return menu
}

function injectComponent(containerId, createComponentFn) {
    const container = document.getElementById(containerId);
    if (container) {
        const component = createComponentFn();
        container.appendChild(component);
    } else {
        console.warn(`Container with ID "${containerId}" not found. Component not injected.`);
    }
}
document.addEventListener("DOMContentLoaded", function() {
    // Inject the Header
    injectComponent('header', createHeader);
    injectComponent('mobileMenu', mobileMenu)
    document.getElementById('mobile-menu-toggle').addEventListener('click', function() {
        var mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
      });
}
)
