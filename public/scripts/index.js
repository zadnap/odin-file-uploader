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
