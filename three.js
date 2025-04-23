
// import * as THREE from '../../node_modules/three';
// import vertexShader from './vertexShader.glsl';
// import fragmentShader from './fragmentShader.glsl';


// import glslify from 'glslify';
// import noise from 'glsl-noise/simplex/2d';

// const snoise2 = require('glsl-noise/simplex/2d');

const width = window.innerWidth;
const height = window.innerHeight;

const renderer = new THREE.WebGLRenderer();
// const renderer = new THREE.WebGLRenderer({
//     canvas: document.querySelector('#myCanvas'),
//     // antialias: true,
// });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x555555, 1);
renderer.setSize(width, height);

// renderer.domElementにしろ上のセレクタで要素を取得してcanavaを作るにしろ
// canvasのサイズが２倍になってる　Retina displayだから？？
// cssで指定しても無駄
const canvas = renderer.domElement;
document.body.appendChild( canvas );


    
const fov = 60;
const fovRad = (Math.PI / 180 )* (fov / 2);

const dist = (height / 2) / Math.tan(fovRad);
    
const camera = new THREE.PerspectiveCamera(fov, width / height, 1, dist * 2);
camera.position.z = dist;

// const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
// camera.position.z = 5;

const scene = new THREE.Scene();



// geometryに　window.innerWidthを指定しても　mesh.scaleがなぜか　1になってる 
// geometryはあくまで形状を定義するものでピクセル単位でサイズを指定するものではない？らしい
// mesh.scale でサイズをやった方が何かとうまく行く　原因は知りたいけど

const geometry = new THREE.PlaneGeometry(1, 1);
// const geometry = new THREE.PlaneGeometry(400, 400);
// const geometry = new THREE.PlaneGeometry(width/2, height/2);
// const geometry = new THREE.PlaneGeometry(width, height);



// const pWidth = 500;
// const pHeight = 500;

const pWidth = width;
const pHeight = height;

const circlePos = new THREE.Vector2(0.0);

document.addEventListener('mousemove', (e)=>{

    // WegGLの座標は、原点が中心みたいだけれど、st座標の原点はUV座標と同じ
    circlePos.x = e.clientX / width;
    circlePos.y = -e.clientY / height + 1.0;
    
    // console.log(e.clientX, e.clientY)
    // console.log(circlePos)
    // e.clientY = 1
    // - circlePos.y = 0
});

// console.log(circlePos)


const uniforms = {
    uTime: { value: 0.0 },

    // そもそものwindowサイズと追加したcanvasのサイズが違うから
    // widnwoの解像度云々はcanvasのサイズでやらないといけない
    uResolution: { value: new THREE.Vector2(canvas.width, canvas.height) },
    // uResolution: { value: new THREE.Vector2(width, height) },

    uCirclePos: {value: circlePos},

    // color1: { value: new THREE.Color(0xf4f7f8) },
    color1: { value: new THREE.Color(0x065175) },
    // color1: { value: new THREE.Color(0x15334a) },
    
    // color2: { value: new THREE.Color(0x0000ff) },
    color2: { value: new THREE.Color(0x065175) },
    color2: { value: new THREE.Color(0xf4f7f8) },
    // color2: { value: new THREE.Color(0xf364e59) }, 

    uTexture1: {value: new THREE.TextureLoader().load('./_226c3807-361d-479f-a7ec-4032cd8b741d.jpeg')},
    uTexture2: {value: new THREE.TextureLoader().load('./_814cc3cb-16a2-490f-9057-2c74991d3f7d.jpeg')}

};


const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
        varying vec2 vUv;
        void main() {
        vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }
    `,
    fragmentShader: `


    // orb center distance st - center smoothstep 
    // 中心に orbを出す
    // マウスの動きに合わせて centerが移動
    // 写真をミックスする 
    // 



        varying vec2 vUv;
        uniform vec2 uResolution;
        uniform vec2 uCirclePos;
        uniform float uTime;
        uniform sampler2D uTexture1;
        uniform sampler2D uTexture2;
    
        uniform vec3 color1;
        uniform vec3 color2;



        float circle(in vec2 _st, in float _radius, in float blurriness){
            vec2 dist = _st;
            return 1.-smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
        }



        // 1次元のPerlinノイズを生成する関数
        float noise(float x) {
          return fract(sin(x) * 43758.5453);
          // return fract(sin(x) * 2.0);
        }
        
        



        vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
        return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise3(vec3 v)
        {
            const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
            const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

            // First corner
            vec3 i  = floor(v + dot(v, C.yyy) );
            vec3 x0 =   v - i + dot(i, C.xxx) ;

            // Other corners
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min( g.xyz, l.zxy );
            vec3 i2 = max( g.xyz, l.zxy );

            //   x0 = x0 - 0.0 + 0.0 * C.xxx;
            //   x1 = x0 - i1  + 1.0 * C.xxx;
            //   x2 = x0 - i2  + 2.0 * C.xxx;
            //   x3 = x0 - 1.0 + 3.0 * C.xxx;
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
            vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

            // Permutations
            i = mod289(i);
            vec4 p = permute( permute( permute(
                        i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

            // Gradients: 7x7 points over a square, mapped onto an octahedron.
            // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
            float n_ = 0.142857142857; // 1.0/7.0
            vec3  ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

            vec4 x = x_ *ns.x + ns.yyyy;
            vec4 y = y_ *ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4( x.xy, y.xy );
            vec4 b1 = vec4( x.zw, y.zw );

            //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
            //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
            vec4 s0 = floor(b0)*2.0 + 1.0;
            vec4 s1 = floor(b1)*2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
            vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

            vec3 p0 = vec3(a0.xy,h.x);
            vec3 p1 = vec3(a0.zw,h.y);
            vec3 p2 = vec3(a1.xy,h.z);
            vec3 p3 = vec3(a1.zw,h.w);

            //Normalise gradients
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            // Mix final noise value
            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                            dot(p2,x2), dot(p3,x3) ) );
        }



        void main() {

            // float offx = vUv.x + sin(vUv.y + uTime * .1);
            // float offy = vUv.y - uTime * 0.1 - cos(uTime * .001) * .01;
            // float n = snoise3(vec3(offx, offy, uTime * .1) * 4.) - 1.;
            float n = snoise3(vec3(vUv.x, vUv.y, uTime*.1));
            // float noise = snoise(vec3(vUv,uTime));

            // gl_FragColor = vec4(vec3(n),1.0);


            vec4 texture1 = texture2D(uTexture1,vUv);
            vec4 texture2 = texture2D(uTexture2,vUv);
            vec4 mixedTexture = mix(texture1, texture2, n);
            // gl_FragColor = mixedTexture;
            

            vec3 mixedColor = mix(color1, color2, n);
            gl_FragColor = vec4(mixedColor,1.0);

        }
    `,
});



const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// イベントリスナー　リサイズでやってたら　初期設定もそれでしてくれる？
// mesh.scale.set(width,height,1);

// console.log(mesh.scale)




window.addEventListener('resize', onResize);

function onResize() {
    
    const width = window.innerWidth;
    const height = window.innerHeight;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    
    
    mesh.scale.set(width,height,1);
    // uniforms.uResolution.value =  [canvas.width, canvas.height]
    uniforms.uResolution.value.set(canvas.width, canvas.height); 

    uniforms.uCirclePos.value =  circlePos;



    // renderer.render(scene, camera);


}

onResize();

// function animate(){
const animate = () => {
    material.uniforms.uTime.value += 0.012;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};
animate();


