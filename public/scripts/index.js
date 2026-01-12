const newFolderBtn = document.querySelector('#new-folder-btn');
const newFileBtn = document.querySelector('#new-file-btn');
const deleteBtn = document.querySelector('#delete-btn');
const shareBtn = document.querySelector('#share-btn');

const createFolderModal = document.querySelector('#create-folder-modal');
const uploadFileModal = document.querySelector('#upload-file-modal');
const deleteFileModal = document.querySelector('#delete-file-modal');
const shareDocModal = document.querySelector('#share-doc-modal');

const closeCreateModalBtn = createFolderModal.querySelector('.close-btn');
const closeUploadModalBtn = uploadFileModal.querySelector('.close-btn');
const closeDeleteModalBtn = deleteFileModal.querySelector('.close-btn');
const closeShareModalBtn = shareDocModal.querySelector('.close-btn');

const fileInput = document.querySelector('#file-input');
const fileDisplay = document.querySelector('#file-display');

const openModal = (modal) => {
  modal.querySelector('form').reset();
  modal.hidden = false;
};

const closeModal = (modal) => {
  modal.hidden = true;
};

newFolderBtn.addEventListener('click', () => openModal(createFolderModal));
newFileBtn.addEventListener('click', () => openModal(uploadFileModal));
deleteBtn.addEventListener('click', () => openModal(deleteFileModal));
shareBtn.addEventListener('click', () => openModal(shareDocModal));

closeCreateModalBtn.addEventListener('click', () =>
  closeModal(createFolderModal)
);
closeUploadModalBtn.addEventListener('click', () => {
  closeModal(uploadFileModal);
  fileDisplay.textContent = 'No file chosen';
});
closeDeleteModalBtn.addEventListener('click', () =>
  closeModal(deleteFileModal)
);
closeShareModalBtn.addEventListener('click', () => closeModal(shareDocModal));

createFolderModal.addEventListener('click', (e) => {
  if (e.target === createFolderModal) {
    closeModal(createFolderModal);
  }
});
uploadFileModal.addEventListener('click', (e) => {
  if (e.target === uploadFileModal) {
    closeModal(uploadFileModal);
    fileDisplay.textContent = 'No file chosen';
  }
});
deleteFileModal.addEventListener('click', (e) => {
  if (e.target === deleteFileModal) {
    closeModal(deleteFileModal);
  }
});
shareDocModal.addEventListener('click', (e) => {
  if (e.target === shareDocModal) {
    closeModal(shareDocModal);
  }
});

fileInput.addEventListener('change', () => {
  fileDisplay.textContent =
    fileInput.files.length > 0 ? fileInput.files[0].name : 'No file chosen';
});

const detailPanel = document.querySelector('#details');
const closePanelBtn = detailPanel.querySelector('.close-detail-btn');
const fileList = document.querySelector('.file-list');
const fileInfoTitle = document.querySelector('#file-info-title');

const openBtn = document.getElementById('open-btn');
const downloadBtn = document.getElementById('download-btn');

fileList.addEventListener('click', (e) => {
  const row = e.target.closest('.file-row');
  if (!row) {
    return;
  }

  const data = row.dataset;

  if (data.type === 'folder') {
    fileInfoTitle.textContent = 'Folder Information';
  } else {
    fileInfoTitle.textContent = 'File Information';
  }
  detailPanel.dataset.id = data.id;
  document.getElementById('detail-name').textContent = data.name;
  document.getElementById('detail-type').textContent =
    data.type === 'folder' ? 'Folder' : data.type;
  document.getElementById('detail-size').textContent = data.size || '—';
  document.getElementById('detail-size-field').ariaHidden =
    data.type === 'folder';
  document.getElementById('detail-author').textContent = data.author;
  document.getElementById('detail-created').textContent = data.createdAt;

  [openBtn, shareBtn, deleteBtn, downloadBtn].forEach((btn) => {
    btn.classList.add('hidden');
  });

  if (data.type === 'folder') {
    openBtn.classList.remove('hidden');
    shareBtn.classList.remove('hidden');
    deleteBtn.classList.remove('hidden');
  } else {
    downloadBtn.classList.remove('hidden');
    shareBtn.classList.remove('hidden');
    deleteBtn.classList.remove('hidden');
  }

  detailPanel.hidden = false;
  requestAnimationFrame(() => {
    detailPanel.classList.add('is-visible');
  });

  document
    .querySelectorAll('.file-row.active')
    .forEach((el) => el.classList.remove('active'));
  row.classList.add('active');
});

closePanelBtn.addEventListener('click', () => {
  detailPanel.classList.remove('is-visible');

  detailPanel.addEventListener(
    'transitionend',
    () => {
      detailPanel.hidden = true;
    },
    { once: true }
  );

  document
    .querySelectorAll('.file-row.active')
    .forEach((el) => el.classList.remove('active'));
});

openBtn.addEventListener('click', () => {
  const url = new URL(window.location.href);
  const base = url.origin;
  const nextUrl = `${base}/folders/${detailPanel.dataset.id}`;

  window.location.href = nextUrl;
});

const headers = document.querySelectorAll('.file-header-column');

headers.forEach((btn) => {
  btn.addEventListener('click', () => {
    const sortBy = btn.dataset.sort;
    const url = new URL(window.location.href);

    const currentSort = url.searchParams.get('sortBy');
    const currentOrder = url.searchParams.get('order') || 'descending';

    let nextOrder = 'descending';

    if (currentSort === sortBy) {
      nextOrder = currentOrder === 'descending' ? 'ascending' : 'descending';
    }

    url.searchParams.set('sortBy', sortBy);
    url.searchParams.set('order', nextOrder);
    url.searchParams.set('page', '1');

    window.location.href = url.toString();
  });
});
