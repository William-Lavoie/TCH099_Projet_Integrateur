
//function pour aside pliable
document.addEventListener('DOMContentLoaded', function () {
    var toggleButton = document.getElementById('BtnPliable');
    var aside = document.querySelector('aside');
    var content = document.querySelector('content');
    var btnPliable = document.querySelector('.BtnPliable');
    

    toggleButton.addEventListener('click', function () {
        var isCollapsed = aside.classList.toggle('collapsed');
        content.classList.toggle('collapsed');

        if (isCollapsed) {
            btnPliable.classList.add('collapsed');
        } else {
            btnPliable.classList.remove('collapsed');
        }
    });
});