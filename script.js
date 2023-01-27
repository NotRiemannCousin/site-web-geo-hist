// #region variables
var previusHeight = 0;
var showResume = null;
var fullMapSize = false;
var selectedMap = null;
var mapChanging = false;
var frameRate = 120;

mousePos = {
    x: 0,
    y: 0,
};

// #endregion

// #region function

function viewboxAnim(svg, view, time) {
    if (mapChanging == true) return;
    mapChanging = true;

    let lastView = svg.getAttribute('viewBox').split(' ');

    view.forEach((n) => parseFloat(n));
    lastView.forEach((n) => parseFloat(n));

    for (let i = 0; i < time * frameRate; i++) {
        setTimeout(() => {
            for (let index = 0; index < 4; index++)
                lastView[index] = (
                    parseFloat(lastView[index]) +
                    ((parseFloat(view[index]) - parseFloat(lastView[index])) * i) /
                    (time * frameRate)
                ).toFixed(2);

            svg.setAttribute(
                'viewBox',
                `${lastView[0]} ${lastView[1]} ${lastView[2]} ${lastView[3]}`
            );

            if (i == time * frameRate - 1) {
                mapChanging = false;
                svg.setAttribute(
                    'viewBox',
                    `${view[0]} ${view[1]} ${view[2]} ${view[3]}`
                );
            }
        }, i * 1000 / frameRate);
    }
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

    for (i = 0; i < paths.length; i++) {
        paths[i].addEventListener('mouseenter', (e) => {
            if (selectedMap != null)
                //  && e.currentTarget != selectedMap
                return;

            let text = e.currentTarget.getAttribute('data-text').split('§');

            str = `
            <h3 style="color: var(----)">${e.currentTarget.getAttribute('data-name')}</h3>
            <h3>Principais Conflitos e Zonas de Tensão</h3>
            <hr/>
            ${text.map(el => `<a href="#" class="link">${el}</a>\n`).join('<hr class= "division" />\n')}`;
            resume.innerHTML = str;
            console.log(str);
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
                Array.from(document.getElementsByTagName('path')).map((elem) => {
                    if (elem != e.currentTarget) elem.style.opacity = 0;
                });

                let box = e.currentTarget.getAttribute('data-box').split(',');

                viewboxAnim(document.getElementById('map'), box, 1);
                map.style.width = '100%';

                document.getElementsByTagName('aside')[0].style.width = parseFloat(window.innerWidth / 3) + 'px';
            } else {
                selectedMap = e.currentTarget;

                Array.from(document.getElementsByTagName('path')).map((elem) => {
                    if (elem != selectedMap) elem.style.opacity = 1;
                });

                selectedMap = null;
                viewboxAnim(map, map.getAttribute('data-viewbox').split(' '), 1);

                document.getElementsByTagName('aside')[0].style.width = '0';
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

        document.getElementById('map').style.setProperty('height', '100vh');
        document.getElementById('map').style.setProperty('width', 'auto');
        if (fullMapSize) {
            document.getElementById('map').style.removeProperty('height');
            document.getElementById('map').style.removeProperty('width');
        }

        fullMapSize = !fullMapSize;
    });
    // #endregion
});
