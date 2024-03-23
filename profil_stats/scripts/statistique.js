document.addEventListener('DOMContentLoaded', function() {
    const gridContainer = document.getElementById('grid-container');
    const rows = 20;
    const cols = 7;

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-item');
            // if a ete present grille est verte.....
            
            gridContainer.appendChild(cell);
        }
    }
});
