document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('input[name="animal"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (event) => {
            checkboxes.forEach(cb => {
                if (cb !== event.target) {
                    cb.checked = false;
                }
            });
            if (event.target.checked) {
                showAnimalImage(event.target.value);
            } else {
                document.getElementById('animalImage').innerHTML = '';
            }
        });
    });
});

function showAnimalImage(animal) {
    const imageElement = document.createElement('img');
    imageElement.src = `static/images/${animal}.jpg`;
    imageElement.alt = animal;
    document.getElementById('animalImage').innerHTML = '';
    document.getElementById('animalImage').appendChild(imageElement);
}

async function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Please select a file');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const result = await response.json();
            document.getElementById('fileInfo').innerHTML = `
                <p>File Name: ${result.filename}</p>
                <p>File Size: ${result.size} bytes</p>
                <p>File Type: ${result.content_type}</p>
            `;
        } else {
            const errorText = await response.text();
            throw new Error(`File upload failed: ${errorText}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while uploading the file: ' + error.message);
    }
}
