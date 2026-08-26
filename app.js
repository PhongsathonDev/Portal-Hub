/**
 * ==============================================================================
 * Study Notes Hub - Main Application Logic
 * ==============================================================================
 */

// Application State
const state = {
  activeCategory: 'all',
  activeYear: 'all',
  activeSemester: 'all',
  activeTag: null,
  searchQuery: '',
  sortBy: 'featured',
  onlyFavorites: false,
  isMoreFiltersOpen: false,
  viewMode: localStorage.getItem('studynotes_view') || 'grid',
  theme: localStorage.getItem('studynotes_theme') || 'dark',
  favorites: JSON.parse(localStorage.getItem('studynotes_favs') || '[]')
};

// DOM Elements
const elements = {
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  navYearSelect: document.getElementById('navYearSelect'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  categoryTabsContainer: document.getElementById('categoryTabsContainer'),
  semesterChipGroup: document.getElementById('semesterChipGroup'),
  sortSelect: document.getElementById('sortSelect'),
  favoritesOnlyBtn: document.getElementById('favoritesOnlyBtn'),
  favoriteCountText: document.getElementById('favoriteCountText'),
  gridViewBtn: document.getElementById('gridViewBtn'),
  listViewBtn: document.getElementById('listViewBtn'),
  notesGridContainer: document.getElementById('notesGridContainer'),
  emptyState: document.getElementById('emptyState'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  resultCountBadge: document.getElementById('resultCountBadge'),
  totalCountBadge: document.getElementById('totalCountBadge'),
  sectionTitleText: document.getElementById('sectionTitleText'),
  activeFilterTagsBar: document.getElementById('activeFilterTagsBar'),
  activeTagName: document.getElementById('activeTagName'),
  removeTagFilterBtn: document.getElementById('removeTagFilterBtn'),
  howToAddBtn: document.getElementById('howToAddBtn'),
  howToAddModal: document.getElementById('howToAddModal'),
  closeHowToAddModal: document.getElementById('closeHowToAddModal'),
  gotItBtn: document.getElementById('gotItBtn'),
  toastContainer: document.getElementById('toastContainer'),
  footerTotalNotes: document.getElementById('footerTotalNotes'),
  footerTotalCategories: document.getElementById('footerTotalCategories')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateCategoryCounts();
  renderCategoryTabs();
  renderCards();
  updateStats();
  setupEventListeners();
  applyViewMode();
});

/**
 * Theme Management (Dark / Light)
 */
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  updateThemeIcon();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  localStorage.setItem('studynotes_theme', state.theme);
  updateThemeIcon();
}

function updateThemeIcon() {
  if (!elements.themeToggleBtn) return;
  const icon = elements.themeToggleBtn.querySelector('i');
  if (state.theme === 'dark') {
    icon.className = 'fa-solid fa-sun';
    elements.themeToggleBtn.setAttribute('title', 'สลับเป็นโหมดสว่าง (Light Mode)');
  } else {
    icon.className = 'fa-solid fa-moon';
    elements.themeToggleBtn.setAttribute('title', 'สลับเป็นโหมดมืด (Dark Mode)');
  }
}

/**
 * Category & Stats Management
 */
function updateCategoryCounts() {
  const total = knowledgeSheetsData.length;
  categoriesData.forEach(cat => {
    if (cat.id === 'all') {
      cat.count = total;
    } else {
      cat.count = knowledgeSheetsData.filter(item => item.category === cat.id).length;
    }
  });
}

function updateStats() {
  const total = knowledgeSheetsData.length;
  if (elements.totalCountBadge) elements.totalCountBadge.textContent = total;
  if (elements.footerTotalNotes) elements.footerTotalNotes.textContent = total;
  if (elements.footerTotalCategories) elements.footerTotalCategories.textContent = categoriesData.length - 1; // exclude 'all'
  updateFavoritesCount();
}

function updateFavoritesCount() {
  if (elements.favoriteCountText) {
    elements.favoriteCountText.textContent = state.favorites.length;
  }
}

/**
 * Render Category Filter Tabs
 */
function renderCategoryTabs() {
  if (!elements.categoryTabsContainer) return;
  elements.categoryTabsContainer.innerHTML = '';

  categoriesData.forEach(cat => {
    // Only render categories that have notes (or 'all')
    if (cat.count === 0 && cat.id !== 'all') return;

    const pill = document.createElement('button');
    pill.className = `category-pill ${state.activeCategory === cat.id ? 'active' : ''}`;
    pill.setAttribute('data-category', cat.id);
    pill.innerHTML = `
      <i class="fa-solid ${cat.icon}"></i>
      <span>${cat.name}</span>
      <span class="category-count">${cat.count}</span>
    `;

    pill.addEventListener('click', () => {
      setCategoryFilter(cat.id);
    });

    elements.categoryTabsContainer.appendChild(pill);
  });
}

function setCategoryFilter(categoryId) {
  state.activeCategory = categoryId;
  
  // Update active pill UI
  document.querySelectorAll('.category-pill').forEach(pill => {
    if (pill.getAttribute('data-category') === categoryId) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  renderCards();
}

/**
 * Update Subfilter UI (Navbar Year Selector & Semester Chips)
 */
function updateSubfiltersUI() {
  // Sync Navbar Year Select
  if (elements.navYearSelect) {
    elements.navYearSelect.value = state.activeYear;
  }

  // Update Semester Chips
  if (elements.semesterChipGroup) {
    elements.semesterChipGroup.querySelectorAll('.filter-chip-btn').forEach(btn => {
      if (btn.getAttribute('data-semester') === state.activeSemester) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }
}

/**
 * Filter & Sort Logic
 */
function getFilteredNotes() {
  return knowledgeSheetsData.filter(item => {
    // Category Filter
    if (state.activeCategory !== 'all' && item.category !== state.activeCategory) {
      return false;
    }

    // Academic Year Filter (ปี 1, 2, 3)
    if (state.activeYear !== 'all' && String(item.year) !== state.activeYear) {
      return false;
    }

    // Semester Filter (เทอม 1, 2)
    if (state.activeSemester !== 'all' && String(item.semester) !== state.activeSemester) {
      return false;
    }

    // Tag Filter
    if (state.activeTag && !item.tags.includes(state.activeTag)) {
      return false;
    }

    // Favorites Filter
    if (state.onlyFavorites && !state.favorites.includes(item.id)) {
      return false;
    }

    // Search Query (matches title, description, tags, categoryName, year, semester)
    if (state.searchQuery.trim() !== '') {
      const q = state.searchQuery.toLowerCase().trim();
      const yearText = `ปี ${item.year}`;
      const semText = `เทอม ${item.semester}`;
      const yearSemText = `ปี ${item.year} เทอม ${item.semester}`;

      const matchTitle = item.title.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchCat = item.categoryName.toLowerCase().includes(q);
      const matchYear = yearText.toLowerCase().includes(q) || semText.toLowerCase().includes(q) || yearSemText.toLowerCase().includes(q);
      const matchTags = item.tags.some(tag => tag.toLowerCase().includes(q));

      if (!matchTitle && !matchDesc && !matchCat && !matchYear && !matchTags) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // Sorting
    if (state.sortBy === 'featured') {
      if (a.isFeatured !== b.isFeatured) {
        return a.isFeatured ? -1 : 1;
      }
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (state.sortBy === 'latest') {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    } else if (state.sortBy === 'titleAsc') {
      return a.title.localeCompare(b.title, 'th');
    }
    return 0;
  });
}

/**
 * Render Cards Grid / List
 */
function renderCards() {
  const filtered = getFilteredNotes();
  updateSubfiltersUI();
  
  // Update Results Badge & Section Title
  if (elements.resultCountBadge) elements.resultCountBadge.textContent = filtered.length;
  
  if (state.onlyFavorites) {
    elements.sectionTitleText.textContent = 'วิชาโปรดที่บันทึกไว้';
  } else if (state.activeCategory !== 'all') {
    const catObj = categoriesData.find(c => c.id === state.activeCategory);
    let title = catObj ? `หมวดหมู่: ${catObj.name}` : 'สรุปบทเรียน';
    if (state.activeYear !== 'all') title += ` (ปี ${state.activeYear})`;
    if (state.activeSemester !== 'all') title += ` (เทอม ${state.activeSemester})`;
    elements.sectionTitleText.textContent = title;
  } else {
    let title = 'สรุปบทเรียนทั้งหมด';
    if (state.activeYear !== 'all' || state.activeSemester !== 'all') {
      const parts = [];
      if (state.activeYear !== 'all') parts.push(`ปี ${state.activeYear}`);
      if (state.activeSemester !== 'all') parts.push(`เทอม ${state.activeSemester}`);
      title = `สรุปบทเรียน (${parts.join(' ')})`;
    }
    elements.sectionTitleText.textContent = title;
  }

  // Active Tag Bar update
  if (state.activeTag) {
    elements.activeFilterTagsBar.style.display = 'flex';
    elements.activeTagName.textContent = `#${state.activeTag}`;
  } else {
    elements.activeFilterTagsBar.style.display = 'none';
  }

  // Check Empty State
  if (filtered.length === 0) {
    elements.notesGridContainer.style.display = 'none';
    elements.emptyState.style.display = 'block';
    return;
  }

  elements.notesGridContainer.style.display = 'grid';
  elements.emptyState.style.display = 'none';
  elements.notesGridContainer.innerHTML = '';

  // Render each note card
  filtered.forEach(note => {
    const isFav = state.favorites.includes(note.id);
    const card = createNoteCardElement(note, isFav);
    elements.notesGridContainer.appendChild(card);
  });
}

/**
 * Create Single Note Card Element
 */
function createNoteCardElement(note, isFav) {
  const card = document.createElement('article');
  card.className = `note-card color-${note.themeColor || 'blue'}`;
  card.setAttribute('data-id', note.id);

  // Formatted date
  const formattedDate = formatDateThai(note.updatedAt);

  // Generate tags HTML
  const tagsHtml = note.tags.map(tag => `
    <button class="tag-chip" data-tag="${tag}">#${tag}</button>
  `).join('');

  // Year & Semester badge
  const yearSemBadge = note.year && note.semester 
    ? `<span class="card-year-badge"><i class="fa-solid fa-graduation-cap"></i> ปี ${note.year} เทอม ${note.semester}</span>` 
    : '';

  card.innerHTML = `
    <div>
      <div class="card-header">
        <div class="category-badge-wrap">
          <div class="card-icon-box">
            <i class="fa-solid ${note.icon || 'fa-book'}"></i>
          </div>
          <div>
            <div class="card-category-name">${note.categoryName}</div>
            <div class="card-badge-row">
              ${yearSemBadge}
            </div>
          </div>
        </div>

        <div class="card-actions-top">
          <button class="card-btn-fav ${isFav ? 'active' : ''}" title="${isFav ? 'ลบออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}" data-fav-id="${note.id}">
            <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-star"></i>
          </button>
        </div>
      </div>

      <div class="card-main-content">
        <h3 class="card-title">${escapeHTML(note.title)}</h3>
        <p class="card-description">${escapeHTML(note.description)}</p>

        <div class="card-tags">
          ${tagsHtml}
        </div>
      </div>
    </div>

    <div class="card-footer">
      <div class="card-meta">
        <div class="card-meta-item" title="วันที่อัปเดต">
          <i class="fa-regular fa-clock"></i>
          <span>${formattedDate}</span>
        </div>
        ${note.sheetCount ? `
          <div class="card-meta-item" title="ความยาวเนื้อหา">
            <i class="fa-regular fa-file-lines"></i>
            <span>${note.sheetCount}</span>
          </div>
        ` : ''}
      </div>

      <div class="card-buttons">
        <button class="btn-card-action btn-copy-link" data-url="${note.url}" title="คัดลอกลิงก์">
          <i class="fa-regular fa-copy"></i>
        </button>
        <a href="${note.url}" target="_blank" rel="noopener noreferrer" class="btn-open-site" title="เปิดอ่านเว็บไซต์สรุป">
          <span>เปิดอ่าน</span>
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </a>
      </div>
    </div>
  `;

  // Attach card event listeners
  // Favorite Button
  const favBtn = card.querySelector('.card-btn-fav');
  favBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(note.id);
  });

  // Copy Link Button
  const copyBtn = card.querySelector('.btn-copy-link');
  copyBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    copyToClipboard(note.url);
  });

  // Tag click filtering
  card.querySelectorAll('.tag-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.stopPropagation();
      const tag = chip.getAttribute('data-tag');
      setTagFilter(tag);
    });
  });

  return card;
}

/**
 * Date Formatter (Thai format: 15 ก.พ. 68)
 */
function formatDateThai(dateStr) {
  if (!dateStr) return '';
  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];
  try {
    const d = new Date(dateStr);
    const day = d.getDate();
    const month = thaiMonths[d.getMonth()];
    const year = (d.getFullYear() + 543).toString().slice(-2);
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

/**
 * Filter by Tag
 */
function setTagFilter(tag) {
  state.activeTag = tag;
  renderCards();
}

/**
 * Favorites Feature (LocalStorage)
 */
function toggleFavorite(id) {
  const index = state.favorites.indexOf(id);
  if (index > -1) {
    state.favorites.splice(index, 1);
    showToast('ลบออกจากรายการโปรดแล้ว', 'info');
  } else {
    state.favorites.push(id);
    showToast('บันทึกในรายการโปรดเรียบร้อย ⭐', 'success');
  }

  localStorage.setItem('studynotes_favs', JSON.stringify(state.favorites));
  updateFavoritesCount();
  renderCards();
}

/**
 * View Switcher (Grid vs List)
 */
function setViewMode(mode) {
  state.viewMode = mode;
  localStorage.setItem('studynotes_view', mode);
  applyViewMode();
}

function applyViewMode() {
  if (state.viewMode === 'list') {
    elements.notesGridContainer.classList.add('list-view');
    elements.listViewBtn.classList.add('active');
    elements.gridViewBtn.classList.remove('active');
  } else {
    elements.notesGridContainer.classList.remove('list-view');
    elements.gridViewBtn.classList.add('active');
    elements.listViewBtn.classList.remove('active');
  }
}

/**
 * Copy to Clipboard with Toast Notification
 */
function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('คัดลอกลิงก์เรียบร้อยแล้ว!', 'success');
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('คัดลอกลิงก์เรียบร้อยแล้ว!', 'success');
  } catch (err) {
    showToast('ไม่สามารถคัดลอกลิงก์ได้', 'error');
  }
  document.body.removeChild(textArea);
}

/**
 * Toast Notification Banner
 */
function showToast(message, type = 'success') {
  if (!elements.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  let icon = 'fa-check-circle';
  if (type === 'info') icon = 'fa-info-circle';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${escapeHTML(message)}</span>
  `;

  elements.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

/**
 * Reset All Filters
 */
function resetAllFilters() {
  state.activeCategory = 'all';
  state.activeYear = 'all';
  state.activeSemester = 'all';
  state.activeTag = null;
  state.searchQuery = '';
  state.onlyFavorites = false;
  state.sortBy = 'featured';

  // Update Controls UI
  elements.searchInput.value = '';
  elements.clearSearchBtn.style.display = 'none';
  if (elements.sortSelect) elements.sortSelect.value = 'featured';
  if (elements.navYearSelect) elements.navYearSelect.value = 'all';
  if (elements.favoritesOnlyBtn) elements.favoritesOnlyBtn.classList.remove('active');

  setCategoryFilter('all');
}

/**
 * Utilities
 */
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Event Listeners Setup
 */
function setupEventListeners() {
  // Theme Toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Navbar Year Select
  if (elements.navYearSelect) {
    elements.navYearSelect.addEventListener('change', (e) => {
      state.activeYear = e.target.value;
      renderCards();
    });
  }

  // Direct Semester Chips
  if (elements.semesterChipGroup) {
    elements.semesterChipGroup.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-chip-btn');
      if (!btn) return;
      state.activeSemester = btn.getAttribute('data-semester');
      renderCards();
    });
  }

  // Search Input
  elements.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery.length > 0) {
      elements.clearSearchBtn.style.display = 'block';
    } else {
      elements.clearSearchBtn.style.display = 'none';
    }
    renderCards();
  });

  // Clear Search Button
  elements.clearSearchBtn.addEventListener('click', () => {
    elements.searchInput.value = '';
    elements.clearSearchBtn.style.display = 'none';
    state.searchQuery = '';
    elements.searchInput.focus();
    renderCards();
  });

  // Keyboard shortcut '/' to focus search & 'Esc' to clear/close
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== elements.searchInput) {
      e.preventDefault();
      elements.searchInput.focus();
      elements.searchInput.select();
    } else if (e.key === 'Escape') {
      if (elements.howToAddModal.style.display !== 'none') {
        elements.howToAddModal.style.display = 'none';
      } else if (elements.searchInput.value !== '') {
        elements.searchInput.value = '';
        elements.clearSearchBtn.style.display = 'none';
        state.searchQuery = '';
        renderCards();
      }
    }
  });

  // Sort Select
  if (elements.sortSelect) {
    elements.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      renderCards();
    });
  }

  // Favorites Only Toggle
  if (elements.favoritesOnlyBtn) {
    elements.favoritesOnlyBtn.addEventListener('click', () => {
      state.onlyFavorites = !state.onlyFavorites;
      if (state.onlyFavorites) {
        elements.favoritesOnlyBtn.classList.add('active');
      } else {
        elements.favoritesOnlyBtn.classList.remove('active');
      }
      renderCards();
    });
  }

  // View Layout Buttons
  if (elements.gridViewBtn) elements.gridViewBtn.addEventListener('click', () => setViewMode('grid'));
  if (elements.listViewBtn) elements.listViewBtn.addEventListener('click', () => setViewMode('list'));

  // Remove Tag Filter
  if (elements.removeTagFilterBtn) {
    elements.removeTagFilterBtn.addEventListener('click', () => {
      state.activeTag = null;
      renderCards();
    });
  }

  // Reset Filters Button
  if (elements.resetFiltersBtn) elements.resetFiltersBtn.addEventListener('click', resetAllFilters);

  // How to Add Modal
  if (elements.howToAddBtn) {
    elements.howToAddBtn.addEventListener('click', () => {
      elements.howToAddModal.style.display = 'flex';
    });
  }

  if (elements.closeHowToAddModal) {
    elements.closeHowToAddModal.addEventListener('click', () => {
      elements.howToAddModal.style.display = 'none';
    });
  }

  if (elements.gotItBtn) {
    elements.gotItBtn.addEventListener('click', () => {
      elements.howToAddModal.style.display = 'none';
    });
  }

  if (elements.howToAddModal) {
    elements.howToAddModal.addEventListener('click', (e) => {
      if (e.target === elements.howToAddModal) {
        elements.howToAddModal.style.display = 'none';
      }
    });
  }
}
