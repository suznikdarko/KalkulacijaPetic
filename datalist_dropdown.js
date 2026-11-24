/* Univerzalni spustni seznam za vsa <input list="..."> polja (Chrome, Edge, Firefox) */
(function () {
    if (window.__UNIVERSAL_DATALIST_INIT__) return;
    window.__UNIVERSAL_DATALIST_INIT__ = true;

    let dropdown = null;
    let activeInput = null;
    let activeIndex = -1;
    let currentItems = [];

    function ensureDropdown() {
        if (dropdown) return dropdown;
        dropdown = document.createElement('div');
        dropdown.id = 'universal-datalist-dropdown';
        dropdown.style.cssText = [
            'position:fixed',
            'display:none',
            'z-index:999999',
            'background:#0f172a',
            'color:#f8fafc',
            'border:1px solid #3b82f6',
            'border-radius:8px',
            'box-shadow:0 12px 32px rgba(0,0,0,0.65)',
            'max-height:260px',
            'overflow-y:auto',
            'font-family:inherit',
            'font-size:0.85rem',
            'box-sizing:border-box'
        ].join(';');
        document.body.appendChild(dropdown);
        return dropdown;
    }

    function hideDropdown() {
        if (dropdown) dropdown.style.display = 'none';
        activeInput = null;
        activeIndex = -1;
        currentItems = [];
    }

    function getOptionsForInput(input) {
        const listId = input.dataset.customDatalist;
        if (!listId) return [];
        const dl = document.getElementById(listId);
        if (!dl) return [];
        const opts = [];
        dl.querySelectorAll('option').forEach(opt => {
            const val = (opt.value || opt.getAttribute('value') || '').trim();
            const label = (opt.label || opt.textContent || '').trim();
            if (val) opts.push({ value: val, label: label && label !== val ? label : '' });
        });
        return opts;
    }

    function positionDropdown(input) {
        const box = ensureDropdown();
        const rect = input.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const maxH = 260;
        const width = Math.max(rect.width, 220);

        box.style.width = Math.min(width, window.innerWidth - 16) + 'px';
        let left = rect.left;
        if (left + width > window.innerWidth - 8) {
            left = Math.max(8, window.innerWidth - width - 8);
        }
        box.style.left = left + 'px';

        if (spaceBelow < 160 && rect.top > spaceBelow) {
            box.style.maxHeight = Math.min(maxH, rect.top - 12) + 'px';
            box.style.top = 'auto';
            box.style.bottom = (window.innerHeight - rect.top + 3) + 'px';
        } else {
            box.style.maxHeight = Math.min(maxH, Math.max(120, spaceBelow - 12)) + 'px';
            box.style.bottom = 'auto';
            box.style.top = (rect.bottom + 3) + 'px';
        }
    }

    function selectItem(input, val) {
        input.value = val;
        input.oldValue = val;
        hideDropdown();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function highlightItem(idx) {
        if (!dropdown) return;
        const rows = dropdown.querySelectorAll('.udl-item');
        rows.forEach((r, i) => {
            r.style.background = i === idx ? '#1e3a8a' : 'transparent';
        });
        if (idx >= 0 && rows[idx]) {
            rows[idx].scrollIntoView({ block: 'nearest' });
        }
    }

    function renderDropdown(input) {
        const allOpts = getOptionsForInput(input);
        if (!allOpts.length) {
            hideDropdown();
            return;
        }
        const q = (input.value || '').trim().toLowerCase();
        const filtered = q
            ? allOpts.filter(o => o.value.toLowerCase().includes(q) || (o.label && o.label.toLowerCase().includes(q)))
            : allOpts;

        if (!filtered.length) {
            hideDropdown();
            return;
        }

        const box = ensureDropdown();
        activeInput = input;
        activeIndex = -1;
        currentItems = filtered.slice(0, 80);

        box.innerHTML = '';
        currentItems.forEach((item, idx) => {
            const row = document.createElement('div');
            row.className = 'udl-item';
            row.style.cssText = 'padding:7px 12px; cursor:pointer; border-bottom:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; gap:8px;';

            const mainSpan = document.createElement('span');
            mainSpan.textContent = item.value;
            mainSpan.style.fontWeight = '600';
            row.appendChild(mainSpan);

            if (item.label) {
                const subSpan = document.createElement('span');
                subSpan.textContent = item.label;
                subSpan.style.cssText = 'font-size:0.75rem; color:#94a3b8; white-space:nowrap;';
                row.appendChild(subSpan);
            }

            row.addEventListener('mouseenter', () => {
                activeIndex = idx;
                highlightItem(activeIndex);
            });
            row.addEventListener('mousedown', (e) => {
                e.preventDefault();
                selectItem(input, item.value);
            });
            box.appendChild(row);
        });

        positionDropdown(input);
        box.style.display = 'block';
    }

    function bindInput(input) {
        if (!input || input.dataset.customDatalist) return;
        const listId = input.getAttribute('list');
        if (!listId) return;
        input.dataset.customDatalist = listId;
        input.removeAttribute('list');
        input.setAttribute('autocomplete', 'off');

        input.addEventListener('focus', () => {
            setTimeout(() => renderDropdown(input), 0);
        });
        input.addEventListener('click', () => {
            renderDropdown(input);
        });
        input.addEventListener('input', () => {
            renderDropdown(input);
        });
        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (activeInput === input) hideDropdown();
            }, 140);
        });
        input.addEventListener('keydown', (e) => {
            if (!dropdown || dropdown.style.display === 'none' || activeInput !== input) {
                if (e.key === 'ArrowDown') {
                    renderDropdown(input);
                    e.preventDefault();
                }
                return;
            }
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                activeIndex = Math.min(currentItems.length - 1, activeIndex + 1);
                highlightItem(activeIndex);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                activeIndex = Math.max(0, activeIndex - 1);
                highlightItem(activeIndex);
            } else if (e.key === 'Enter' && activeIndex >= 0 && currentItems[activeIndex]) {
                e.preventDefault();
                selectItem(input, currentItems[activeIndex].value);
            } else if (e.key === 'Escape') {
                hideDropdown();
            }
        });
    }

    function initAll() {
        document.querySelectorAll('input[list]').forEach(bindInput);
    }

    document.addEventListener('mousedown', (e) => {
        if (!dropdown || dropdown.style.display === 'none') return;
        if (e.target === activeInput || dropdown.contains(e.target)) return;
        hideDropdown();
    });

    window.addEventListener('scroll', () => {
        if (activeInput && dropdown && dropdown.style.display === 'block') {
            positionDropdown(activeInput);
        }
    }, true);

    window.addEventListener('resize', () => {
        if (activeInput && dropdown && dropdown.style.display === 'block') {
            positionDropdown(activeInput);
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
