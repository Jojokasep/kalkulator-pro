let currentInput = "0";
const resultScreen = document.getElementById("result");

// PIN Rahasia untuk membuka brankas (Kamu bisa mengubah angkanya di sini)
const SECRET_PIN = "1234"; 

function updateScreen() {
    resultScreen.innerText = currentInput;
}

function appendChar(char) {
    if (currentInput === "0" && char !== ".") {
        currentInput = char;
    } else {
        currentInput += char;
    }
    updateScreen();
}

function clearScreen() {
    currentInput = "0";
    updateScreen();
}

function deleteChar() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = "0";
    }
    updateScreen();
}

function calculate() {
    // Mengecek apakah input yang dimasukkan adalah PIN rahasia
    if (currentInput === SECRET_PIN) {
        openVault();
        return;
    }

    try {
        let expression = currentInput.replace(/×/g, '*');
        currentInput = eval(expression).toString();
    } catch (error) {
        currentInput = "Error";
    }
    updateScreen();
}

// Fungsi untuk membuka menu brankas rahasia
function openVault() {
    document.getElementById("calculator-section").style.display = "none";
    document.getElementById("vault-section").style.display = "block";
    loadFilesFromLocalStorage();
}

// Fungsi untuk keluar kembali ke kalkulator
function lockVault() {
    document.getElementById("vault-section").style.display = "none";
    document.getElementById("calculator-section").style.display = "block";
    clearScreen();
}

// Fungsi Menyimpan File ke LocalStorage (mengubah file ke format Base64)
function saveFileToLocalStorage(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64Data = e.target.result;
        
        // Ambil data lama dari localStorage atau buat array baru
        let savedFiles = JSON.parse(localStorage.getItem("vault_files")) || [];
        
        // Masukkan file baru ke dalam array
        savedFiles.push({ name: file.name, data: base64Data });
        
        // Simpan kembali ke localStorage
        localStorage.setItem("vault_files", JSON.stringify(savedFiles));
        
        alert("File berhasil disimpan secara aman di penyimpanan lokal!");
        loadFilesFromLocalStorage();
    };
    reader.readAsDataURL(file);
}

// Fungsi Memuat File dari LocalStorage untuk ditampilkan di Brankas
function loadFilesFromLocalStorage() {
    const fileListContainer = document.getElementById("file-list");
    fileListContainer.innerHTML = "";

    let savedFiles = JSON.parse(localStorage.getItem("vault_files")) || [];

    if (savedFiles.length === 0) {
        fileListContainer.innerHTML = "<p>Belum ada file tersimpan.</p>";
        return;
    }

    savedFiles.forEach((file, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.className = "file-item";

        // Jika file berupa gambar, tampilkan preview-nya
        let preview = `<span style="font-size:12px;">${file.name}</span>`;
        if (file.data.startsWith("data:image")) {
            preview = `<img src="${file.data}" alt="preview">`;
        }

        itemDiv.innerHTML = `
            ${preview}
            <button onclick="deleteFile(${index})" style="background:#ff3b30; color:white; border:none; padding:5px; border-radius:3px; cursor:pointer;">Hapus</button>
        `;
        fileListContainer.appendChild(itemDiv);
    });
}

// Fungsi Menghapus File dari LocalStorage
function deleteFile(index) {
    let savedFiles = JSON.parse(localStorage.getItem("vault_files")) || [];
    savedFiles.splice(index, 1);
    localStorage.setItem("vault_files", JSON.stringify(savedFiles));
    loadFilesFromLocalStorage();
}
