function init() {
    const imageSelectorWrapper = document.getElementById('image-selector-wrapper');
    let canvasWrapper, actions, canvas, addTextInp, addTextBtn, imageSaver, deleteIcon, textColorInp, strokeColorInp, strokeColorBtn, textColorBtn;
    const imagesConfig = [
        {
            imageSrc: './images/template-1.jpg'
        },
        {
            imageSrc: './images/template-2.jpg'
        },
        {
            imageSrc: './images/template-3.jpg'
        },
        {
            imageSrc: './images/template-4.jpg'
        },
        {
            imageSrc: './images/template-5.jpg'
        },
        {
            imageSrc: './images/template-6.jpg'
        },
        {
            imageSrc: './images/template-7.jpg'
        },
        {
            imageSrc: './images/template-8.jpg'
        },
        {
            imageSrc: './images/template-9.jpg'
        },
        {
            imageSrc: './images/template-10.jpg'
        },
        {
            imageSrc: './images/template-11.jpg'
        },
        {
            imageSrc: './images/template-12.png'
        },
        {
            imageSrc: './images/template-13.jpg'
        },
        {
            imageSrc: './images/template-14.jpg'
        },
        {
            imageSrc: './images/template-15.jpg'
        }
    ];

    createImages();

    function createImages() {
        function onDivClick(e) {
            const imageSrc = this.getAttribute("data-image-src");

            imageSelectorWrapper.style.display = 'none';
            initCanvas(imageSrc);
        }

        const imageDivS = imagesConfig.map(imageConfig => {
            const colDiv = document.createElement('div');
            colDiv.classList.add('col');

            const cardDiv = document.createElement('div');
            colDiv.appendChild(cardDiv);
            cardDiv.classList.add('card', 'h-100');
            cardDiv.setAttribute('data-image-src', imageConfig.imageSrc);
            cardDiv.addEventListener('click', onDivClick);

            const imageTag = document.createElement('img');
            imageTag.classList.add('card-img-top');
            imageTag.src = imageConfig.imageSrc;
            cardDiv.appendChild(imageTag);

            return colDiv;
        });

        imageDivS.forEach(imageDiv => {
            imageSelectorWrapper.appendChild(imageDiv);
        });
    }

    function initCanvas(imageSrc) {

        canvasWrapper = document.getElementById('canvas-wrapper');
        canvas = new fabric.Canvas("canvas");
        addTextInp = document.getElementById('addTextInp');
        addTextBtn = document.getElementById('addTextBtn');
        imageSaver = document.getElementById('lnkDownload');
        textColorInp = document.getElementById('textColorInp');
        strokeColorInp = document.getElementById('strokeColorInp');
        strokeColorBtn = document.getElementById('strokeColorBtn');
        textColorBtn = document.getElementById('textColorBtn');
        actions = document.getElementById('actions');
        deleteIcon = document.createElement('img');

        const deleteIconSrc = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
        deleteIcon.src = deleteIconSrc;
    
        fabric.Object.prototype.transparentCorners = false;
        fabric.Object.prototype.cornerColor = 'blue';
        fabric.Object.prototype.cornerStyle = 'circle';
    
        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: 0.5,
            y: -0.5,
            cursorStyle: 'pointer',
            mouseUpHandler: deleteObject,
            render: renderIcon,
            cornerSize: 24
        });

        canvas.on({
            'selection:updated': handleSelection,
            'selection:created': handleSelection
        });
        imageSaver.addEventListener('click', saveImage, false);
        textColorBtn.addEventListener('click', changeTextColor, true);
        strokeColorBtn.addEventListener('click', changeStrokeColor, true);
        addTextBtn.addEventListener('click', function() {
            const text = addTextInp.value;
    
            const fabricText = new fabric.IText(text, {
                fill: "#969ADD",
                fontFamily: 'SourceSansPro',
                fontSize: 40,
                stroke: '#ffffff',
                strokeWidth: 4,
                paintFirst: 'stroke',
                editable: true
            });
    
            fabricText.set({
                top: canvas.height / 2 - fabricText.height / 2,
                left: canvas.width / 2 - fabricText.width / 2
            })
    
            console.log(fabricText)
    
            canvas.add(fabricText);
            addTextInp.value = '';
        });
    
        window.canvas = canvas;
        window.wrapper = canvasWrapper;
    
        fabric.Image.fromURL(imageSrc, function(oImg) {
            actions.style.display = 'block';

            const imgRatio = oImg.height / oImg.width;
            const realWidth = canvasWrapper.clientWidth;
            const realHeight = realWidth * imgRatio;
    
            const imgScaleX = realWidth / oImg.width;
            const imgScaleY = realHeight / oImg.height;
            window.canvasWidth = realWidth;
            window.canvasHeight = realHeight;
    
            oImg.set({
                scaleX: imgScaleX,
                scaleY: imgScaleY,
                selectable: false,
                evented: false
            })
    
            console.log(imgRatio);
            console.log(realWidth);
            console.log(realHeight)
    
            canvas.setDimensions({
                width: realWidth,
                height: realHeight
            })
            console.log(oImg)
            canvas.add(oImg);
        });

        function handleSelection(obj){
            console.log("aaa", obj);

            if (obj.selected.length > 0) {
                const selectedObj = obj.selected[0];

                strokeColorInp.value = selectedObj.stroke;
                textColorInp.value = selectedObj.fill;
            }
        }

        function changeTextColor() {
            const activeObject = canvas.getActiveObject();

            if (activeObject) {
                activeObject.set({
                    fill: textColorInp.value
                })
                activeObject.dirty = true;
                canvas.renderAll();
            }
        }

        function changeStrokeColor() {
            
            const activeObject = canvas.getActiveObject();

            if (activeObject) {
                activeObject.set({
                    stroke: strokeColorInp.value
                })
                activeObject.dirty = true;
                canvas.renderAll();
            }
        }

    }

    function deleteObject(eventData, transform) {
		const target = transform.target;
		const canvas = target.canvas;
		    
        canvas.remove(target);
        canvas.requestRenderAll();
	}

    function renderIcon(ctx, left, top, styleOverride, fabricObject) {
        var size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(deleteIcon, -size/2, -size/2, size, size);
        ctx.restore();
    }

}

function saveImage(e) {

    e.preventDefault();
    const dataUrl = canvas.toDataURL({
        format: 'png',
        multiplier: canvas.item(0).width / canvas.width
    });

    saveAs(dataUrl, 'mesaj-personalizat.png');
}

document.addEventListener('DOMContentLoaded', init);



