// init html
const graphContainerSection = document.querySelector('.section-7');
graphContainerSection.innerHTML = `
    <template id="graph-node-template">
        <svg xmlns="http://www.w3.org/2000/svg">
            <g class="node">
                <foreignObject class="test">
                    <span style="user-select: none"></span>
                </foreignObject>
            </g>
        </svg>
    </template>
    <div id="stars1"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <div id="graph-container" style="height: 600px;background: radial-gradient(ellipse at bottom, #231C38 0%, #161224 100%);">
        <svg id="graph" xmlns="http://www.w3.org/2000/svg" style="width: 100%;height: 100%">
            <g id="mover">
                <g id="zoomer">
                </g>
            </g>
        </svg>
    </div>
`;
// DOM
const graph = document.querySelector('#graph');
// init data
const data = [
    ["高学历", ["学术代表", "博士", "硕士", "名校毕业", "学业优秀"]],
    ["理科生", ["计算机科学", "医学", "工程学", "金融", "数学专业"]],
    ["文科生", ["老师", "文艺青年", "教育工作者", "医护"]],
    ["乐观", ["幽默", "笑容可掬", "豁达", "阳光", "爱交际"]],
    ["有个性", ["极简主义", "安静", "冷静", "沉默寡言", "独立思考"]],
    ["家庭责任感", ["孝顺父母", "家庭和睦", "重视家庭"]],
    ["爱好运动", ["健身", "跑步", "游泳", "骑行", "滑雪", "极限运动"]],
    ["爱好音乐", ["弹琴", "唱歌", "音乐会"]],
    ["喜欢旅行", ["远足", "说走就走", "自由背包客", "野外露营", "独自冒险"]],
    ["事业有成", ["职场精英", "创业成功", "技术专家", "社会头衔"]],
    ["相爱一生", ["相互陪伴", "共同成长", "乐于沟通"]],
    ["社交达人", ["圈子广泛", "善于表达", "爱好广泛"]],
    ["责任心强", ["做事有计划", "执行能力强", "说到做到", "不乱承诺", "思考周密"]],
    ["热爱自由", ["追求精神富足", "独立", "不被束缚", "不婚主义", "丁克"]],
    ["健康生活", ["干饭人", "作息规律", "饮食健康", "保持健身", "精力充沛"]],
    ["有爱心", ["热心公益事业", "乐于助人", "关爱动物"]],
    ["会多门语言", ["有语言天赋", "主流语种", "跨文化交流", "小语种"]],
    ["热爱艺术", ["收藏家", "艺术创作者", "行为艺术", "艺术天赋"]],
    ["科技迷", ["喜欢军事", "爱好数码", "马斯克信徒", "追踪科技潮流"]],
    ["社会责任心", ["志愿者", "关注社会问题", "积极参与社会活动"]],
    ["热爱学习", ["喜欢交流分享", "持续进修", "乐于自我提升"]],
    ["曾创过业", ["财富自由", "有商业头脑", "一心搞钱", "事业成功"]],
    ["独特品位", ["高品质生活", "对生活有审美追求", "吃喝讲究", "厨艺高手"]],
    ["重视形象", ["潮流时尚", "穿搭有品", "化妆打扮", "注重卫生"]],
    ["成熟稳重", ["冷静理智", "通情达理", "坚韧不拔"]],
    ["有好奇心", ["喜欢尝试新事物", "探索多文化", "保持开放态度"]],
    ["环保人士", ["保护环境", "环保生活", "素食主义", "关注环境问题"]],
    ["宠物家人", ["猫咪", "狗狗", "特殊宠物", "对待宠物温柔体贴"]],
    ["电影迷", ["电影编剧", "影评家", "欧美大片", "小众冷门"]],
    ["游戏玩家", ["电子游戏", "桌游", "角色扮演", "手游", "游戏开发者"]],
    ["手工艺人", ["烘焙爱好", "手工制作", "DIY爱好者", "刺绣", "木工"]],
    ["摄影爱好者", ["风光摄影", "人像摄影", "微距摄影", "纪实摄影", "摄影后期处理"]],
    ["养生达人", ["瑜伽", "中医", "食疗", "气功", "冥想"]],
    ["成熟魅力", ["自信帅气", "身姿纤细", "强壮勇猛", "高个子180+"]]
];

{
    // init d3
    function id2Length(id) {
        if (id.startsWith("b-")) {
            return 100
        }
        return id.length < 5 ? 90 : 100
    }

    // 变量
    const dataMap = new Map(data);
    const bubbles = [
        `inset 0 0 60px #f298fa, inset 10px 0 46px #56a2d3, inset 80px 0 80px #4529ff, inset -20px -60px 100px #ffffff, inset 0 0 1px #fff, 0 0 6px #F8F8FFFF`,
        `inset 0 0 60px #abddf8, inset 10px 0 46px #56a2d3, inset 80px 0 80px #2e5fff, inset -20px -60px 100px #ffffff, inset 0 0 1px #fff, 0 0 6px #F8F8FFFF`,
        `inset 0 0 60px #b6baff, inset 10px 0 46px #b9ddf3, inset 80px 0 80px #006e80, inset -20px -60px 100px #ffffff, inset 0 0 1px #fff, 0 0 6px #F8F8FFFF`,
    ]
    const {width, height} = document.querySelector('#graph').getBoundingClientRect();
    const borders = [];
    let n = Math.ceil(width / 100 * 5 / 3);
    for (let i = 0; i < n; i++) {
        let pt = {
            id: `b-t${i}`,
            fx: 50 + i * 100,
            fy: -100,
            r: 100
        }
        let pt_ = {
            id: `b-t${i}-`,
            fx: -pt.fx,
            fy: -100,
            r: 100
        }
        let pb = {
            id: `b-b${i}`,
            fx: pt.fx,
            fy: height,
            r: 100
        }
        let pb_ = {
            id: `b-b${i}-`,
            fx: -pt.fx,
            fy: height,
            r: 100
        }
        borders.push(pt, pt_, pb, pb_)
    }
    let offsetR = 50 + (n - 1) * 100 * 1.5;
    let offsetL = -offsetR / 2;
    n = Math.ceil(height / 100) * 2;
    for (let i = 0; i < n; i++) {
        let pr = {
            id: `b-r${i}`,
            fx: offsetR,
            // fy: -100,
            fy: i * 100,
            r: 100
        }
        let pl = {
            id: `b-l${i}`,
            fx: offsetL,
            // fy: -100,
            fy: i * 100,
            r: 100
        }
        borders.push(pr, pl)
    }
    const nodes = [...dataMap.keys()].map((k, i, arr) => {
        const rows = 4
        const cols = Math.ceil(arr.length / rows)
        const row = Math.floor(i / cols)
        const col = i % cols
        return {
            id: k,
            x: 100 + (Math.random() * 0.5 + 0.5) * col * 145,
            y: 100 + (Math.random() * 0.5 + 0.5) * row * 145,
            r: id2Length(k) / 2 + 1
        }
    })
    nodes.push(...borders)
    const colored = new Map()
    const d3Bubbles = createD3Bubbles({
        svgElement: graph,
        clickCallback: (event, node) => {
            const circle = event.target.tagName === "SPAN" ? event.target.parentNode : event.target;
            if (colored.has(node.id)) {
                if (colored.get(node.id)) {
                    circle.style.background = "hsla(0, 0%, 30%, 0.1)";
                    circle.style.boxShadow = "0 0 6px 0 #4d3779, inset 0 0 12px 0 #514273, inset 0 0 1px #ad8ee7";
                    colored.set(node.id, false)
                } else {
                    circle.style.background = "radial-gradient(circle at 75% 30%, white 5px, aqua 8%, #000041 60%, aqua 100%)";
                    circle.style.boxShadow = bubbles[Math.floor(Math.random() * (bubbles.length - 1))]
                    colored.set(node.id, true)
                }
                return
            }
            colored.set(node.id, true)

            circle.style.background = "radial-gradient(circle at 75% 30%, white 5px, aqua 8%, #000041 60%, aqua 100%)";
            circle.style.boxShadow = bubbles[Math.floor(Math.random() * (bubbles.length - 1))]
            const matches = dataMap.get(node.id);
            if (matches?.length) {
                let angle = 360 * Math.PI / (180 * matches.length);
                let distance = 20;
                for (let i = 0; i < matches.length; i++) {
                    let newX = node.x + distance * Math.cos(angle * i);
                    let newY = node.y + distance * Math.sin(angle * i);
                    let newNode = {
                        id: matches[i], x: newX, y: newY, r: id2Length(matches[i]) / 2
                    }
                    nodes.push(newNode);
                }
                d3Bubbles.update(nodes);
            }
        }
    });
    // initialize
    d3Bubbles.update(nodes)

    function createD3Bubbles({svgElement, clickCallback}) {
        const svg = d3.select(svgElement);
        const zoomer = svg.select('#zoomer');
        let node = zoomer.append("g").selectAll('g');
        const simulation = d3.forceSimulation()
            .force("x", d3.forceX(width / 2).strength(0.002))
            .force("y", d3.forceY(height / 2))
            // .force("center",d3.forceCenter(width/2,height/2))
            .force("collide", d3.forceCollide().radius(d => d.r + 8))
            .force("charge", d3.forceManyBody().strength(30))
            .on("tick", () => {
                node.attr('transform', d => `translate(${d.x},${d.y})`);
            });
        return Object.assign(svg.node(), {
            update(nodes) {
                const oldNodes = new Map(node.data().map(d => [d.id, d]));
                nodes = nodes.map(d => Object.assign({}, oldNodes.get(d.id) || d));
                simulation.nodes(nodes);
                simulation.alpha(0.1).alphaDecay(0.02).restart();
                node = node
                    .data(nodes, d => d.id)
                    .join(enter => {
                        return enter.append(d => {
                            const node = document.querySelector('#graph-node-template').content.firstElementChild.querySelector('.node').cloneNode(true);
                            const circle = node.querySelector('foreignObject');
                            circle.style.width = id2Length(d.id);
                            circle.style.height = id2Length(d.id);
                            if (d.id.startsWith("b-")) {
                                circle.style.border = "1px solid red"; // borders
                                return node
                            }
                            circle.style.fontSize = "0.9rem"
                            circle.style.borderRadius = "50%";
                            circle.style.textAlign = "center";
                            circle.style.lineHeight = id2Length(d.id) + "px";
                            circle.style.border = "none";
                            circle.style.background = "hsla(0, 0%, 30%, 0.1)";
                            circle.style.boxShadow = "0 0 6px 0 #4d3779, inset 0 0 12px 0 #514273, inset 0 0 1px #ad8ee7";
                            circle.style.color = "#BFC4C9";
                            const span = node.querySelector('span');
                            span.textContent = d.id
                            d3.select(circle)
                                .transition()
                                .duration(2000000)
                                .attr('x', d.x + 100);
                            return node;
                        })
                    })
                    .on('click', clickCallback)
                    .call(drag(simulation));
            }
        });
    }

    function drag(simulation) {
        function dragstarted(event, d) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        function dragged(event, d) {
            console.log(`id=${d.id} fx=${d.fx.toFixed(0)}/${width.toFixed(0)} fy=${d.fy.toFixed(0)}/${height.toFixed(0)}`);
            d.fx = event.x;
            d.fy = event.y;
        }

        function dragended(event, d) {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }

    // listen graph move
    const mover = document.querySelector('#mover');
    let startPoint = {x: 0, y: 0};
    let newPoint = {x: 0, y: 0};
    let lastPoint = {x: 0, y: 0};

    let xr = offsetL,xl = offsetR+offsetL-100
    function updatePoint(e) {
        const {clientX, clientY} = e;
        const deltaX = clientX - startPoint.x;
        // const deltaY = clientY - startPoint.y;
        newPoint = {
            x: lastPoint.x + deltaX, y: lastPoint.y,
        };
        if (newPoint.x > xl) {
            newPoint.x = xl
        } else if (newPoint.x < xr) {
            newPoint.x = xr
        }


        mover.style.transform = `translate(${newPoint.x}px, ${newPoint.y}px)`;
    }

    function handleStart(e) {
        let clientX, clientY;
        if (e.touches) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        startPoint = {
            x: clientX, y: clientY
        }
        graph.addEventListener('mousemove', updatePoint);
        graph.addEventListener('touchmove', updatePoint);
    }

    function handleEnd(e) {
        lastPoint = newPoint;
        graph.removeEventListener('mousemove', updatePoint);
        graph.removeEventListener('touchmove', updatePoint);
    }

    graph.addEventListener('mousedown', handleStart);
    document.addEventListener('mouseup', handleEnd);

    graph.addEventListener('touchstart', handleStart);
    document.addEventListener('touchend', handleEnd);
}
