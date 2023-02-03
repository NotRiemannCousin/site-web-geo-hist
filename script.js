// #region variables
var previusHeight = 0;
var showResume = null;
var fullMapSize = false;
var selectedMap = null;
var mapChanging = false;
var frameRate = 60;

mousePos = {
    x: 0,
    y: 0,
};

// #endregion

// #region function

function viewboxAnim(animate, to, time) {
    if (mapChanging == true) return;
    mapChanging = true;

    animate.setAttribute('from', animate.getAttribute('to'));
    animate.setAttribute('to', to);
    animate.setAttribute('dur', time);

    animate.beginElement();

    setInterval(() => { mapChanging = false; }, 1000 * time);
}
// #endregion

window.addEventListener('load', () => {

    // #region mouse capture
    const root = document.documentElement;
    document.addEventListener('mousemove', (e) => {
        mousePos.x = e.pageX;
        mousePos.y = e.pageY;
        // root.style.setProperty('--mouse-x', evt.clientX);
        // root.style.setProperty('--mouse-y', evt.clientY);
    });
    // #endregion

    // #region tooltip map and select continent
    var resume = document.getElementById('onhover-conflitos');
    var paths = document.getElementsByTagName('path');
    var map = document.getElementById('map');
    var aside = document.getElementsByTagName('aside')[0];
    var main = document.getElementsByTagName('main')[0];
    var svg_anim = document.getElementById('svg-anim');

    for (i = 0; i < paths.length; i++) {
        paths[i].addEventListener('mouseenter', (e) => {
            if (selectedMap != null)
                //  && e.currentTarget != selectedMap
                return;

            let text = e.currentTarget.getAttribute('data-text').split('§');
            let link = e.currentTarget.getAttribute('data-link').split('§');

            for (let i = 0; i < text.length; i++) {
                text[i] = `<a href="conflicts/${link[i]}.html" class="link">${text[i]}</a>\n`;
            }

            str = `
            <h2>${e.currentTarget.getAttribute('data-name')}</h2>
            <h3 style="color: var(---light)">Principais Conflitos e Zonas de Tensão</h3>
            <hr/>
            ${text.join('<hr class= "division" />\n')}`;

            resume.innerHTML = str;
        });

        paths[i].addEventListener('mousemove', (e) => {
            if (selectedMap != null)
                //  && e.currentTarget != selectedMap
                return;
            clearTimeout(showResume);
            showResume = setTimeout(() => {
                resume.classList.add('fade-in');
                resume.style.top =
                    (mousePos.y <
                        document.body.clientHeight - document.body.clientWidth * 0.2
                        ? mousePos.y + 1
                        : mousePos.y - document.body.clientWidth * 0.2) + 'px';
                resume.style.left =
                    (mousePos.x < document.body.clientWidth * 0.8
                        ? mousePos.x + 1
                        : mousePos.x - document.body.clientWidth * 0.2) + 'px';
            }, 500);
        });

        paths[i].addEventListener('mouseout', (e) => {
            resume.classList.remove('fade-in');
            clearTimeout(showResume);
        });

        paths[i].addEventListener('click', (e) => {
            resume.classList.remove('fade-in');

            if (
                (selectedMap != null && e.currentTarget != selectedMap) ||
                mapChanging == true
            )
                return;

            if (selectedMap == null) {
                selectedMap = e.currentTarget;
                Array.from(paths).map((elem) => {
                    if (elem != selectedMap) elem.style.opacity = 0;
                });

                viewboxAnim(svg_anim, selectedMap.getAttribute('data-box'), 1);


                let text = e.currentTarget.getAttribute('data-text').split('§');
                let link = e.currentTarget.getAttribute('data-link').split('§');

                for (let i = 0; i < text.length; i++) {
                    text[i] = `<a href="conflicts/${link[i]}.html">${text[i]}</a>\n`;
                }

                aside.innerHTML = `
                <div class="aside-content">
                <hr>
                <h1>
                ${selectedMap.getAttribute('data-name')}
                </h1>
                <hr>
                ${text.join('')}
                </div>`;

                map.style.width = '100%';
                if (window.matchMedia('(min-width: 414px)').matches)
                    aside.style.width = '33.333vw';
                else
                    aside.style.height = 'auto';

            } else {
                selectedMap = e.currentTarget;

                Array.from(paths).map((elem) => {
                    if (elem != selectedMap) elem.style.opacity = 1;
                });


                selectedMap = null;
                viewboxAnim(svg_anim, map.getAttribute('data-viewbox'), 1);


                if (window.matchMedia('(min-width: 414px)').matches)
                    aside.style.width = '0';
                // else
                // aside.style.height = '0';  

                aside.style.translate = 'inherit';
                map.style.width = 'inherit';
            }
        });
    }

    resume.addEventListener('mouseover', () => {
        resume.classList.add('fade-in');
    });

    resume.addEventListener('mouseleave', (e) => {
        resume.classList.remove('fade-in');
    });
    // #endregion

    // #region fit map
    document.getElementById('fit-map').addEventListener('click', () => {
        let mode = fullMapSize ? 'block' : 'none';
        document.getElementsByTagName('header')[0].style.display = mode;
        document.getElementsByTagName('footer')[0].style.display = mode;

        map.style.setProperty('height', '100vh');
        map.style.setProperty('width', 'auto');
        map.style.padding = '0';
        main.style.padding = '0';
        document.body.style.padding = '0';

        if (fullMapSize) {
            map.style.removeProperty('height');
            map.style.removeProperty('width');
            map.style.padding = 'inherit';
            main.style.padding = 'inherit';
            document.body.style.padding = 'inherit';
        }

        fullMapSize = !fullMapSize;
    });
    // #endregion
});
