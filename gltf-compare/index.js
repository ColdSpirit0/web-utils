let scene1 = new THREE.Scene();
let scene2 = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.5, 3);

let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new THREE.OrbitControls(camera, renderer.domElement);

scene1.background = new THREE.Color(0x556655);
scene2.background = new THREE.Color(0x555566);

scene1.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));
scene2.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1.2));

let model1 = null, model2 = null;
const loader = new THREE.GLTFLoader();

let split = window.innerWidth / 2;
let mouseX = split;

// track mouse but apply only if both models loaded
renderer.domElement.addEventListener("mousemove", e => {
    if (model1 && model2) {
        mouseX = e.clientX;
    }
});

// Drag & Drop handler
function handleDrop(mainFile, fileMap, side) {
    const reader = new FileReader();

    reader.onload = ev => {
        const blobURLs = {};
        for (const name in fileMap) {
            const blob = new Blob([fileMap[name]]);
            blobURLs[name] = URL.createObjectURL(blob);
        }

        // Manager for path remapping
        const manager = new THREE.LoadingManager();
        manager.setURLModifier(url => {
            const fileName = url.split("/").pop();
            if (blobURLs[fileName]) {
                return blobURLs[fileName];
            }
            return url;
        });

        const customLoader = new THREE.GLTFLoader(manager);

        customLoader.parse(ev.target.result, "", gltf => {
            const model = gltf.scene;
            model.traverse(obj => {
                if (obj.isMesh) obj.material.side = cullingMode;
            });

            if (side === "left") {
                if (model1) scene1.remove(model1);
                model1 = model;
                scene1.add(model1);
                document.getElementById("fileNameLeft").textContent = mainFile.name;
                document.getElementById("drop-left").style.display = "none";
            } else {
                if (model2) scene2.remove(model2);
                model2 = model;
                scene2.add(model2);
                document.getElementById("fileNameRight").textContent = mainFile.name;
                document.getElementById("drop-right").style.display = "none";
            }
        });
    };

    if (mainFile.name.toLowerCase().endsWith(".glb")) {
        reader.readAsArrayBuffer(mainFile);
    } else {
        reader.readAsText(mainFile);
    }
}

function getExtension(str) {
    let parts = str.split(".");
    if (parts.length > 0) {
        return parts[parts.length - 1].toLowerCase();
    }
    return null;
}

function setupDropZone(el, side) {
    el.addEventListener("dragover", e => { e.preventDefault(); });
    el.addEventListener("drop", e => {
        e.preventDefault();

        if (e.dataTransfer.files.length === 0) return;

        const files = e.dataTransfer.files;
        const fileMap = {};
        let mainFile = null;

        // collect all files in a map and find the main .gltf/.glb file
        for (const file of files) {
            fileMap[file.name] = file;

            const ext = getExtension(file.name);
            if (!mainFile && (ext === "gltf" || ext === "glb")) {
                mainFile = file;
            }
        }

        if (!mainFile) {
            alert("No .gltf or .glb file found!");
            return;
        }

        handleDrop(mainFile, fileMap, side);
    });
}

setupDropZone(document.getElementById("drop-left"), "left");
setupDropZone(document.getElementById("drop-right"), "right");

// Toggle backface culling
let cullingMode = THREE.FrontSide;
document.getElementById("toggleCulling").onclick = () => {
    cullingMode = (cullingMode === THREE.FrontSide) ? THREE.DoubleSide : THREE.FrontSide;
    document.getElementById("toggleCulling").textContent = (cullingMode === THREE.FrontSide) ? "Cull: ON" : "Cull: OFF";

    [model1, model2].forEach(m => {
        if (m) m.traverse(obj => {
            if (obj.isMesh) obj.material.side = cullingMode;
        });
    });
};

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    const width = window.innerWidth;
    const height = window.innerHeight;

    // divider only moves when both models are loaded
    if (model1 && model2) {
        split = Math.max(0, Math.min(mouseX, width));
    } else {
        split = width / 2;
    }

    document.getElementById("divider").style.left = split + "px";
    renderer.setScissorTest(true);

    // Left part
    renderer.setViewport(0, 0, width, height);
    renderer.setScissor(0, 0, split, height);
    renderer.render(scene1, camera);

    // Right part
    renderer.setViewport(0, 0, width, height);
    renderer.setScissor(split, 0, width - split, height);
    renderer.render(scene2, camera);

    renderer.setScissorTest(false);
}
animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
