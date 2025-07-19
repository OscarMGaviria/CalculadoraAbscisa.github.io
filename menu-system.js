// ===========================
// 📋 MÓDULO DE MENÚS COLAPSABLES
// ===========================

class CollapsibleMenuSystem {
    constructor() {
        this.menus = new Map();
        this.activeMenus = new Set();
        this.globalConfig = {
            animation: true,
            animationDuration: 300,
            closeOnClickOutside: true,
            allowMultiple: false,
            theme: 'default'
        };
        this.init();
    }

    // Inicializar el sistema
    init() {
        this.addStyles();
        this.setupGlobalEvents();
        console.log('📋 Sistema de menús colapsables inicializado');
    }

    // Agregar estilos CSS dinámicamente
    addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* ===========================
               ESTILOS BASE DEL MENÚ
               =========================== */
            .collapsible-menu {
                position: relative;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.18);
                overflow: hidden;
                z-index: 1000;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                min-width: 200px;
                max-width: 400px;
            }

            /* Header del menú */
            .menu-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, var(--primary-50, #eef2ff), var(--secondary-50, #ecfeff));
                border-bottom: 1px solid rgba(0, 0, 0, 0.08);
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-weight: 600;
                color: var(--neutral-800, #1e293b);
            }

            .menu-header:hover {
                background: linear-gradient(135deg, var(--primary-100, #e0e7ff), var(--secondary-100, #cffafe));
            }

            .menu-header.active {
                background: linear-gradient(135deg, var(--primary-600, #4f46e5), var(--secondary-600, #0891b2));
                color: white;
            }

            .menu-title {
                display: flex;
                align-items: center;
                gap: 12px;
                font-size: 15px;
            }

            .menu-icon {
                font-size: 16px;
                width: 20px;
                text-align: center;
            }

            .menu-toggle {
                font-size: 14px;
                transition: transform 0.3s ease;
                opacity: 0.7;
            }

            .menu-header.active .menu-toggle {
                transform: rotate(180deg);
                opacity: 1;
            }

            /* Contenido del menú */
            .menu-content {
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-height: 0;
                opacity: 0;
            }

            .menu-content.expanded {
                max-height: 500px;
                opacity: 1;
            }

            .menu-options {
                padding: 8px 0;
            }

            /* Opciones del menú */
            .menu-option {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 20px;
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--neutral-700, #334155);
                font-size: 14px;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
            }

            .menu-option:hover {
                background: var(--primary-50, #eef2ff);
                color: var(--primary-700, #4338ca);
                padding-left: 24px;
            }

            .menu-option:active {
                background: var(--primary-100, #e0e7ff);
                transform: scale(0.98);
            }

            .menu-option.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                pointer-events: none;
            }

            .menu-option.danger:hover {
                background: var(--error-50, #fef2f2);
                color: var(--error-700, #b91c1c);
            }

            .menu-option.success:hover {
                background: var(--success-50, #ecfdf5);
                color: var(--success-700, #047857);
            }

            .menu-option.warning:hover {
                background: var(--warning-50, #fff7ed);
                color: var(--warning-700, #c2410c);
            }

            .option-icon {
                font-size: 16px;
                width: 18px;
                text-align: center;
                flex-shrink: 0;
            }

            .option-label {
                flex: 1;
                font-weight: 500;
            }

            .option-badge {
                background: var(--primary-100, #e0e7ff);
                color: var(--primary-700, #4338ca);
                padding: 2px 8px;
                border-radius: 12px;
                font-size: 11px;
                font-weight: 600;
            }

            .option-shortcut {
                font-size: 11px;
                opacity: 0.6;
                font-family: monospace;
            }

            /* Separadores */
            .menu-separator {
                height: 1px;
                background: var(--neutral-200, #e2e8f0);
                margin: 8px 16px;
            }

            /* Submenús */
            .menu-option.has-submenu .option-label::after {
                content: '›';
                margin-left: auto;
                font-size: 16px;
                opacity: 0.5;
            }

            /* Temas alternativos */
            .collapsible-menu.theme-dark {
                background: rgba(15, 23, 42, 0.95);
                color: white;
                border-color: rgba(255, 255, 255, 0.1);
            }

            .collapsible-menu.theme-dark .menu-header {
                background: linear-gradient(135deg, rgba(51, 65, 85, 0.8), rgba(71, 85, 105, 0.8));
                color: white;
                border-color: rgba(255, 255, 255, 0.1);
            }

            .collapsible-menu.theme-dark .menu-option {
                color: #e2e8f0;
            }

            .collapsible-menu.theme-dark .menu-option:hover {
                background: rgba(51, 65, 85, 0.5);
                color: white;
            }

            /* Responsive */
            @media (max-width: 768px) {
                .collapsible-menu {
                    min-width: 250px;
                    max-width: 90vw;
                }
                
                .menu-header {
                    padding: 14px 16px;
                }
                
                .menu-option {
                    padding: 14px 16px;
                    font-size: 15px;
                }
            }

            /* Animaciones */
            @keyframes menuSlideIn {
                from {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .collapsible-menu.animating {
                animation: menuSlideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            /* Estados especiales */
            .menu-option.loading .option-icon {
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    // Configurar eventos globales
    setupGlobalEvents() {
        document.addEventListener('click', (e) => {
            if (this.globalConfig.closeOnClickOutside) {
                this.handleOutsideClick(e);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllMenus();
            }
        });
    }

    // Crear un nuevo menú
    createMenu(id, config = {}) {
        const menuConfig = {
            title: config.title || 'Menú',
            icon: config.icon || 'fas fa-bars',
            position: config.position || { top: 50, left: 50 },
            options: config.options || [],
            theme: config.theme || this.globalConfig.theme,
            autoClose: config.autoClose !== false,
            persistent: config.persistent || false,
            container: config.container || document.body,
            className: config.className || '',
            ...config
        };

        // Validar si el menú ya existe
        if (this.menus.has(id)) {
            console.warn(`⚠️ Menú con ID '${id}' ya existe`);
            return this.menus.get(id);
        }

        const menuElement = this.buildMenuElement(id, menuConfig);
        const menu = {
            id,
            config: menuConfig,
            element: menuElement,
            isOpen: false,
            options: new Map()
        };

        this.menus.set(id, menu);
        menuConfig.container.appendChild(menuElement);

        console.log(`📋 Menú '${id}' creado exitosamente`);
        return menu;
    }

    // Construir elemento HTML del menú
    buildMenuElement(id, config) {
        const menuElement = document.createElement('div');
        menuElement.id = `menu-${id}`;
        menuElement.className = `collapsible-menu theme-${config.theme} ${config.className}`;
        
        // Aplicar posición
        menuElement.style.position = 'absolute';
        menuElement.style.top = `${config.position.top}px`;
        menuElement.style.left = `${config.position.left}px`;
        menuElement.style.display = 'none';

        // Header del menú
        const header = document.createElement('div');
        header.className = 'menu-header';
        header.innerHTML = `
            <div class="menu-title">
                <i class="${config.icon} menu-icon"></i>
                <span>${config.title}</span>
            </div>
            <i class="fas fa-chevron-down menu-toggle"></i>
        `;

        // Contenido del menú
        const content = document.createElement('div');
        content.className = 'menu-content';
        
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'menu-options';

        content.appendChild(optionsContainer);
        menuElement.appendChild(header);
        menuElement.appendChild(content);

        // Event listeners
        header.addEventListener('click', () => {
            this.toggleMenu(id);
        });

        // Agregar opciones
        this.updateMenuOptions(id, config.options);

        return menuElement;
    }

    // Actualizar opciones del menú
    updateMenuOptions(menuId, options) {
        const menu = this.menus.get(menuId);
        if (!menu) return;

        const optionsContainer = menu.element.querySelector('.menu-options');
        optionsContainer.innerHTML = '';
        menu.options.clear();

        options.forEach((option, index) => {
            if (option.type === 'separator') {
                const separator = document.createElement('div');
                separator.className = 'menu-separator';
                optionsContainer.appendChild(separator);
                return;
            }

            const optionElement = document.createElement('button');
            optionElement.className = `menu-option ${option.className || ''}`;
            
            if (option.disabled) optionElement.classList.add('disabled');
            if (option.variant) optionElement.classList.add(option.variant);

            optionElement.innerHTML = `
                <i class="${option.icon || 'fas fa-circle'} option-icon ${option.loading ? 'loading' : ''}"></i>
                <span class="option-label">${option.label}</span>
                ${option.badge ? `<span class="option-badge">${option.badge}</span>` : ''}
                ${option.shortcut ? `<span class="option-shortcut">${option.shortcut}</span>` : ''}
            `;

            // Event listener para la opción
            optionElement.addEventListener('click', (e) => {
                e.stopPropagation();
                this.executeOption(menuId, option, index);
            });

            optionsContainer.appendChild(optionElement);
            menu.options.set(index, { element: optionElement, config: option });
        });
    }

    // Ejecutar acción de opción
    executeOption(menuId, option, index) {
        const menu = this.menus.get(menuId);
        if (!menu || option.disabled) return;

        console.log(`📋 Ejecutando opción '${option.label}' del menú '${menuId}'`);

        // Ejecutar callback si existe
        if (typeof option.action === 'function') {
            try {
                option.action({
                    menuId,
                    option,
                    index,
                    menu: this
                });
            } catch (error) {
                console.error(`❌ Error ejecutando acción de '${option.label}':`, error);
            }
        }

        // Auto-cerrar si está configurado
        if (menu.config.autoClose && !option.keepOpen) {
            this.closeMenu(menuId);
        }
    }

    // Mostrar menú
    showMenu(menuId, position = null) {
        const menu = this.menus.get(menuId);
        if (!menu) {
            console.warn(`⚠️ Menú '${menuId}' no encontrado`);
            return;
        }

        // Cerrar otros menús si no se permite múltiples
        if (!this.globalConfig.allowMultiple) {
            this.closeAllMenus();
        }

        // Actualizar posición si se proporciona
        if (position) {
            menu.element.style.top = `${position.top}px`;
            menu.element.style.left = `${position.left}px`;
        }

        menu.element.style.display = 'block';
        menu.isOpen = true;
        this.activeMenus.add(menuId);

        // Animación de entrada
        if (this.globalConfig.animation) {
            menu.element.classList.add('animating');
            setTimeout(() => {
                menu.element.classList.remove('animating');
            }, this.globalConfig.animationDuration);
        }

        console.log(`📋 Menú '${menuId}' mostrado`);
        return menu;
    }

    // Ocultar menú
    hideMenu(menuId) {
        const menu = this.menus.get(menuId);
        if (!menu) return;

        menu.element.style.display = 'none';
        menu.isOpen = false;
        this.activeMenus.delete(menuId);

        // Cerrar el contenido si está expandido
        const header = menu.element.querySelector('.menu-header');
        const content = menu.element.querySelector('.menu-content');
        
        header.classList.remove('active');
        content.classList.remove('expanded');

        console.log(`📋 Menú '${menuId}' ocultado`);
    }

    // Alternar expansión del menú
    toggleMenu(menuId) {
        const menu = this.menus.get(menuId);
        if (!menu) return;

        const header = menu.element.querySelector('.menu-header');
        const content = menu.element.querySelector('.menu-content');
        
        const isExpanded = content.classList.contains('expanded');
        
        if (isExpanded) {
            this.collapseMenu(menuId);
        } else {
            this.expandMenu(menuId);
        }
    }

    // Expandir menú
    expandMenu(menuId) {
        const menu = this.menus.get(menuId);
        if (!menu) return;

        const header = menu.element.querySelector('.menu-header');
        const content = menu.element.querySelector('.menu-content');
        
        header.classList.add('active');
        content.classList.add('expanded');

        console.log(`📋 Menú '${menuId}' expandido`);
    }

    // Colapsar menú
    collapseMenu(menuId) {
        const menu = this.menus.get(menuId);
        if (!menu) return;

        const header = menu.element.querySelector('.menu-header');
        const content = menu.element.querySelector('.menu-content');
        
        header.classList.remove('active');
        content.classList.remove('expanded');

        console.log(`📋 Menú '${menuId}' colapsado`);
    }

    // Cerrar menú completamente
    closeMenu(menuId) {
        this.collapseMenu(menuId);
        setTimeout(() => {
            this.hideMenu(menuId);
        }, this.globalConfig.animationDuration);
    }

    // Cerrar todos los menús
    closeAllMenus() {
        this.activeMenus.forEach(menuId => {
            this.closeMenu(menuId);
        });
    }

    // Manejar clicks fuera del menú
    handleOutsideClick(event) {
        let clickedInsideMenu = false;
        
        this.activeMenus.forEach(menuId => {
            const menu = this.menus.get(menuId);
            if (menu && menu.element.contains(event.target)) {
                clickedInsideMenu = true;
            }
        });

        if (!clickedInsideMenu) {
            this.closeAllMenus();
        }
    }

    // Actualizar opción específica
    updateOption(menuId, optionIndex, updates) {
        const menu = this.menus.get(menuId);
        if (!menu || !menu.options.has(optionIndex)) return;

        const optionData = menu.options.get(optionIndex);
        Object.assign(optionData.config, updates);

        // Reconstruir opciones
        const allOptions = Array.from(menu.options.values()).map(opt => opt.config);
        this.updateMenuOptions(menuId, allOptions);
    }

    // Habilitar/deshabilitar opción
    toggleOptionState(menuId, optionIndex, disabled = null) {
        const menu = this.menus.get(menuId);
        if (!menu || !menu.options.has(optionIndex)) return;

        const optionData = menu.options.get(optionIndex);
        const newState = disabled !== null ? disabled : !optionData.config.disabled;
        
        this.updateOption(menuId, optionIndex, { disabled: newState });
    }

    // Remover menú
    removeMenu(menuId) {
        const menu = this.menus.get(menuId);
        if (!menu) return;

        if (menu.element.parentNode) {
            menu.element.parentNode.removeChild(menu.element);
        }

        this.menus.delete(menuId);
        this.activeMenus.delete(menuId);

        console.log(`📋 Menú '${menuId}' removido`);
    }

    // Obtener estado del menú
    getMenuState(menuId) {
        const menu = this.menus.get(menuId);
        if (!menu) return null;

        return {
            id: menuId,
            isOpen: menu.isOpen,
            isExpanded: menu.element.querySelector('.menu-content').classList.contains('expanded'),
            optionsCount: menu.options.size,
            position: {
                top: parseInt(menu.element.style.top),
                left: parseInt(menu.element.style.left)
            }
        };
    }

    // Configuración global
    setGlobalConfig(config) {
        Object.assign(this.globalConfig, config);
        console.log('📋 Configuración global actualizada:', this.globalConfig);
    }

    // Obtener estadísticas
    getStats() {
        return {
            totalMenus: this.menus.size,
            activeMenus: this.activeMenus.size,
            menusList: Array.from(this.menus.keys())
        };
    }
}

// ===========================
// 🚀 INICIALIZACIÓN GLOBAL
// ===========================

// Crear instancia global
const menuSystem = new CollapsibleMenuSystem();

// ===========================
// 📋 FUNCIONES GLOBALES DE CONVENIENCIA
// ===========================

// Crear menú rápido
function createQuickMenu(id, title, options, position = { top: 100, left: 100 }) {
    return menuSystem.createMenu(id, {
        title,
        options,
        position,
        icon: 'fas fa-list'
    });
}

// Crear menú contextual
function createContextMenu(id, options, event) {
    const position = {
        top: event.clientY + 5,
        left: event.clientX + 5
    };
    
    return menuSystem.createMenu(id, {
        title: 'Opciones',
        options,
        position,
        icon: 'fas fa-ellipsis-v',
        autoClose: true
    });
}

// Mostrar menú en posición específica
function showMenuAt(menuId, x, y) {
    return menuSystem.showMenu(menuId, { top: y, left: x });
}

// Funciones de control rápido
function showMenu(id) { return menuSystem.showMenu(id); }
function hideMenu(id) { return menuSystem.hideMenu(id); }
function toggleMenu(id) { return menuSystem.toggleMenu(id); }
function closeAllMenus() { return menuSystem.closeAllMenus(); }

// ===========================
// 🧪 FUNCIÓN DE PRUEBA
// ===========================

function testMenuSystem() {
    console.log('🧪 Probando sistema de menús...');
    
    // Menú de ejemplo
    const sampleMenu = createQuickMenu('test-menu', 'Menú de Prueba', [
        {
            icon: 'fas fa-file',
            label: 'Nuevo Archivo',
            action: () => alert('Nuevo archivo creado'),
            shortcut: 'Ctrl+N'
        },
        {
            icon: 'fas fa-folder',
            label: 'Abrir Carpeta',
            action: () => alert('Carpeta abierta'),
            badge: 'NEW'
        },
        { type: 'separator' },
        {
            icon: 'fas fa-save',
            label: 'Guardar',
            action: () => alert('Archivo guardado'),
            variant: 'success'
        },
        {
            icon: 'fas fa-trash',
            label: 'Eliminar',
            action: () => alert('Archivo eliminado'),
            variant: 'danger'
        },
        {
            icon: 'fas fa-cog',
            label: 'Configuración',
            disabled: true
        }
    ], { top: 200, left: 200 });
    
    // Mostrar menú después de 1 segundo
    setTimeout(() => {
        showMenu('test-menu');
    }, 1000);
}

// ===========================
// 📖 DOCUMENTACIÓN
// ===========================

/*
SISTEMA DE MENÚS COLAPSABLES:

CARACTERÍSTICAS:
✅ Menús completamente configurables
✅ Opciones con iconos, etiquetas y acciones
✅ Temas claro y oscuro
✅ Animaciones suaves
✅ Responsive design
✅ Atajos de teclado
✅ Badges y shortcuts
✅ Separadores
✅ Estados (disabled, loading, variants)
✅ Auto-cierre configurable
✅ Click fuera para cerrar
✅ Múltiples menús simultáneos (opcional)

FUNCIONES PRINCIPALES:

Crear menús:
- createQuickMenu(id, title, options, position)
- createContextMenu(id, options, event)
- menuSystem.createMenu(id, config)

Controlar menús:
- showMenu(id)
- hideMenu(id) 
- toggleMenu(id)
- closeAllMenus()

Configurar opciones:
- menuSystem.updateOption(menuId, index, updates)
- menuSystem.toggleOptionState(menuId, index, disabled)

EJEMPLO DE USO:

const menu = createQuickMenu('mi-menu', 'Acciones', [
    {
        icon: 'fas fa-play',
        label: 'Ejecutar',
        action: () => console.log('Ejecutando...'),
        shortcut: 'F5'
    },
    { type: 'separator' },
    {
        icon: 'fas fa-stop',
        label: 'Detener',
        action: () => console.log('Deteniendo...'),
        variant: 'danger'
    }
]);

showMenu('mi-menu');

CONFIGURACIÓN DE OPCIONES:
- icon: Clase de icono (FontAwesome)
- label: Texto de la opción
- action: Función a ejecutar
- disabled: true/false
- variant: 'success', 'danger', 'warning'
- badge: Texto de badge
- shortcut: Texto de atajo
- keepOpen: No cerrar menú al hacer clic
- loading: Mostrar spinner en el icono
- className: Clases CSS adicionales

*/