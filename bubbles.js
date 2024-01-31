// init html
const graphContainerSection = document.querySelector('.section-7');
graphContainerSection.innerHTML = `
    <template id="graph-node-template">
        <svg xmlns="http://www.w3.org/2000/svg">
            <g class="node">
                <foreignObject>
                    <span></span>
                </foreignObject>
            </g>
        </svg>
    </template>
    <div id="graph-container" style="height: 650px;">

        <svg id="graph" xmlns="http://www.w3.org/2000/svg" style="width: 100%;height: 100%" viewBox="100 0 100 650">
            <g id="mover" transform="translate(25, 0)">
                <g id="zoomer">
                </g>
            </g>
        </svg>
    </div>
`;
// DOM
const graphContainer = document.querySelector('#graph-container');
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
// init d3
{
    // 变量
    const dataMap = new Map(data);
    const bubbles = [
        `inset 0 0 60px #f298fa, inset 10px 0 46px #56a2d3, inset 80px 0 80px #4529ff, inset -20px -60px 100px #ffffff, inset 0 0 1px #fff, 0 0 6px #F8F8FFFF`,
        `inset 0 0 60px #abddf8, inset 10px 0 46px #56a2d3, inset 80px 0 80px #2e5fff, inset -20px -60px 100px #ffffff, inset 0 0 1px #fff, 0 0 6px #F8F8FFFF`,
        `inset 0 0 60px #b6baff, inset 10px 0 46px #b9ddf3, inset 80px 0 80px #006e80, inset -20px -60px 100px #ffffff, inset 0 0 1px #fff, 0 0 6px #F8F8FFFF`,
    ]
    const panel = {
        nodes: [...dataMap.keys()].map(k => ({id: k})),
        links: []
    }
    const d3Bubbles = createD3Bubbles({
        svgElement: graph,
        clickCallback: (event, node) => {
            const circle = event.target.tagName === "SPAN" ? event.target.parentNode : event.target;
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
                        id: matches[i], x: newX, y: newY
                    }
                    panel.nodes.push(newNode);
                    panel.links.push({
                        source: node, target: newNode.id
                    });
                }
                d3Bubbles.update(panel);
            }
        }
    });
    // initialize
    d3Bubbles.update(panel)

    function createD3Bubbles({svgElement, clickCallback}) {
        const svg = d3.select(svgElement);
        const zoomer = svg.select('#zoomer');
        let node = zoomer.append("g").selectAll('g');
        let windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        console.log(windowWidth)
        console.log(graphContainer.offsetWidth,graphContainer.offsetHeight)
        const simulation = d3.forceSimulation()
            .force("x1", d3.forceX(-windowWidth/2).strength(0.03))
            .force("x2", d3.forceX(0).strength(0.05))
            .force("x3", d3.forceX(windowWidth/2).strength(0.03))
            .force("y", d3.forceY(325).strength(0.2))
            .force("repulsion", d3.forceManyBody().strength(-900))
            .force("collide", d3.forceCollide().radius(d => d.width * 30))
            .force("link", d3.forceLink().id(d => d.id).distance(10).strength(0.01))
            .on("tick", () => {
                node.attr('transform', d => `translate(${d.x},${d.y})`);
            });
        const drag = simulation => {
            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
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
        return Object.assign(svg.node(), {
            update({nodes, links}) {
                const oldNodes = new Map(node.data().map(d => [d.id, d]));
                nodes = nodes.map(d => Object.assign({}, oldNodes.get(d.id) || d));
                links = links.map(d => Object.assign({}, d));
                simulation.nodes(nodes);
                simulation.force("link").links(links);
                simulation.alpha(0.1).alphaDecay(0.02).restart();
                node = node
                    .data(nodes, d => d.id)
                    .join(enter => {
                        return enter.append(d => {
                            const node = document.querySelector('#graph-node-template').content.firstElementChild.querySelector('.node').cloneNode(true);
                            const circle = node.querySelector('foreignObject');
                            circle.style.width = d.id.length < 5 ? 110 : 120;
                            circle.style.height = d.id.length < 5 ? 110 : 120;
                            circle.style.borderRadius = "50%";
                            circle.style.textAlign = "center";
                            circle.style.paddingTop = "42%";
                            circle.style.border = "none";
                            circle.style.background = "hsla(0, 0%, 80%, 0.15)";
                            circle.style.boxShadow = "inset 0 0 20px 0 #b29ebb, inset 0 0 1px #fff, 0 0 5px #ae96c0";
                            circle.style.color = "ghostwhite";
                            const span = node.querySelector('span');
                            span.textContent = d.id
                            circle.setAttribute('transform', 'scale(0.75)');
                            d3.select(circle)
                                .transition()
                                .duration(800)
                                .attr('transform', 'scale(1)');
                            return node;
                        })
                    })
                    .on('click', clickCallback)
                    .call(drag(simulation));
            }
        });
    }
}
// listen graph move
{
    const mover = document.querySelector('#mover');
    let startPoint = {x: 0, y: 0};
    let newPoint = {x: 0, y: 0};
    let lastPoint = {x: 0, y: 0};

    function updatePoint(e) {
        const {clientX, clientY} = e;
        const deltaX = clientX - startPoint.x;
        const deltaY = clientY - startPoint.y;
        newPoint = {
            x: lastPoint.x + deltaX, y: lastPoint.y + deltaY,
        };
        mover.style.transform = `translate(${newPoint.x}px, ${newPoint.y}px)`;
    }

    function handleMouseDown(e) {
        const {clientX, clientY} = e;
        startPoint = {
            x: clientX, y: clientY
        }
        graph.addEventListener('mousemove', updatePoint);
    }

    function handleMouseUp(e) {
        lastPoint = newPoint;
        graph.removeEventListener('mousemove', updatePoint);
    }

    graph.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
}
