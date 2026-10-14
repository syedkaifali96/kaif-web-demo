(() => {
  'use strict';

  const initialize = () => {
    const nav = document.getElementById('site-nav');
    if (nav) {
      let scrollFrame = 0;
      const updateNav = () => {
        nav.classList.toggle('is-scrolled', window.scrollY > 40);
        scrollFrame = 0;
      };
      updateNav();
      window.addEventListener('scroll', () => {
        if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateNav);
      }, { passive: true });
    }

    const openDialogs = new Set();
    let previousBodyOverflow = '';
    const lockScroll = (dialog) => {
      if (!openDialogs.size) {
        previousBodyOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
      }
      openDialogs.add(dialog);
    };
    const unlockScroll = (dialog) => {
      openDialogs.delete(dialog);
      if (!openDialogs.size) document.body.style.overflow = previousBodyOverflow;
    };

    const prepareDialog = (dialog, closeSelector, onToggle = () => {}) => {
      if (!dialog || typeof dialog.showModal !== 'function') return null;
      let returnFocus = null;
      const close = () => {
        if (dialog.open) dialog.close();
      };
      dialog.querySelectorAll(closeSelector).forEach((button) => {
        button.addEventListener('click', close);
      });
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const bounds = dialog.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right ||
            event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      });
      // Native Escape handling and the focus trap remain enabled.
      dialog.addEventListener('close', () => {
        unlockScroll(dialog);
        onToggle(false);
        if (returnFocus && returnFocus.isConnected && !openDialogs.size) {
          returnFocus.focus({ preventScroll: true });
        }
        returnFocus = null;
      });
      return {
        close,
        open: (opener) => {
          if (dialog.open) return;
          returnFocus = opener || document.activeElement;
          dialog.showModal();
          lockScroll(dialog);
          onToggle(true);
        }
      };
    };

    const menuToggle = document.getElementById('menu-toggle');
    const menuPanel = document.getElementById('menu-panel');
    const menu = prepareDialog(menuPanel, '.menu-close', (isOpen) => {
      if (menuToggle) menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    if (menu && menuToggle) {
      menuToggle.addEventListener('click', () => {
        if (menuPanel.open) menu.close();
        else menu.open(menuToggle);
      });
      menuPanel.querySelectorAll('a[href]').forEach((link) => {
        link.addEventListener('click', menu.close);
      });
    }

    const projectGrid = document.querySelector('.project-grid');
    if (projectGrid) {
      const cards = Array.from(projectGrid.querySelectorAll('.project-card'));
      const filters = Array.from(document.querySelectorAll('.project-filters [data-filter]'));
      const search = document.getElementById('repository-search');
      const status = document.getElementById('filter-status');
      const empty = document.getElementById('repository-empty');
      const selectedFilter = filters.find((button) => button.getAttribute('aria-pressed') === 'true');
      let activeFilter = selectedFilter ? selectedFilter.dataset.filter : 'all';
      const normalize = (text) => String(text || '').trim().toLocaleLowerCase();
      const searchableCards = cards.map((card) => ({
        card,
        category: card.dataset.category || '',
        text: normalize([card.dataset.search, card.dataset.repository, card.textContent].join(' '))
      }));

      const updateProjects = () => {
        const query = normalize(search ? search.value : '');
        const terms = query.split(/\s+/).filter(Boolean);
        let visible = 0;
        let publicCount = 0;
        let privateCount = 0;
        searchableCards.forEach(({ card, category, text }) => {
          const matches = (activeFilter === 'all' || category === activeFilter) &&
            terms.every((term) => text.includes(term));
          card.hidden = !matches;
          if (!matches) return;
          visible += 1;
          if (category === 'public') publicCount += 1;
          if (category === 'private') privateCount += 1;
        });
        filters.forEach((button) => {
          const active = button.dataset.filter === activeFilter;
          button.setAttribute('aria-pressed', String(active));
          button.classList.toggle('is-active', active);
        });
        if (status) {
          const count = visible === cards.length ? String(visible) : `${visible} of ${cards.length}`;
          status.textContent = `${count} ${cards.length === 1 ? 'project' : 'projects'} · ${publicCount} public · ${privateCount} private`;
        }
        if (empty) empty.hidden = visible !== 0;
      };

      filters.forEach((button) => {
        button.addEventListener('click', () => {
          activeFilter = button.dataset.filter;
          updateProjects();
        });
      });
      if (search) search.addEventListener('input', updateProjects);
      updateProjects();
    }

    const projectDialog = document.getElementById('project-dialog');
    const projectModal = prepareDialog(projectDialog, '.dialog-close');
    const projectDataElement = document.getElementById('project-data');
    let projectData = null;
    if (projectDataElement) {
      try {
        const parsed = JSON.parse(projectDataElement.textContent);
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) projectData = parsed;
      } catch {
        // A missing or invalid optional data block must not break other pages.
      }
    }
    if (projectModal && projectData) {
      const title = projectDialog.querySelector('#project-title');
      const description = projectDialog.querySelector('#project-description');
      const scope = projectDialog.querySelector('#project-scope');
      document.querySelectorAll('button.project-open[data-project], button.project-notes[data-project]').forEach((button) => {
        button.addEventListener('click', () => {
          const key = button.dataset.project;
          if (!Object.prototype.hasOwnProperty.call(projectData, key)) return;
          const project = projectData[key];
          if (!project || typeof project !== 'object') return;
          if (title) title.textContent = project.title || '';
          if (description) description.textContent = project.description || '';
          if (scope) {
            scope.replaceChildren();
            if (Array.isArray(project.scope)) {
              project.scope.forEach((item) => {
                const listItem = document.createElement('li');
                listItem.textContent = String(item);
                scope.appendChild(listItem);
              });
            }
          }
          projectModal.open(button);
        });
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
