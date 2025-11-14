// script.js
// 等待页面完全加载
document.addEventListener('DOMContentLoaded', function() {
    // 初始化知识图谱
    initKnowledgeGraph();
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'linear-gradient(135deg, #ff69b4, #db7093)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
        } else {
            navbar.style.background = 'linear-gradient(135deg, var(--secondary-color), var(--dark-pink))';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });
    
    // 设置超时，如果知识图谱加载失败则显示备用方案
    setTimeout(function() {
        const chartContainer = document.getElementById('knowledge-graph');
        if (chartContainer.querySelector('canvas') === null && 
            !chartContainer.classList.contains('fallback-loaded')) {
            console.warn('知识图谱加载超时，使用备用方案');
            loadFallbackGraph();
        }
    }, 5000);
});

// 知识图谱数据
const knowledgeData = {
    nodes: [
        { 
            id: 0, 
            name: '磁共振成像', 
            category: 0, 
            symbolSize: 50,
            description: '磁共振成像（MRI）是一种利用核磁共振原理的医学影像技术，能够提供详细的人体内部结构图像。'
        },
        { 
            id: 1, 
            name: '物理原理', 
            category: 1, 
            symbolSize: 30,
            description: '磁共振成像基于原子核在磁场中的共振现象，通过射频脉冲激发和接收信号来生成图像。'
        },
        { 
            id: 2, 
            name: '临床应用', 
            category: 1, 
            symbolSize: 30,
            description: 'MRI广泛应用于神经系统、肌肉骨骼系统、心血管系统等疾病的诊断和评估。'
        },
        { 
            id: 3, 
            name: '设备组成', 
            category: 1, 
            symbolSize: 30,
            description: 'MRI设备主要由磁体系统、梯度系统、射频系统和计算机系统组成。'
        },
        { 
            id: 4, 
            name: '核磁共振', 
            category: 2, 
            symbolSize: 25,
            description: '核磁共振是原子核在磁场中对特定频率的电磁波产生共振吸收的现象。'
        },
        { 
            id: 5, 
            name: '射频脉冲', 
            category: 2, 
            symbolSize: 25,
            description: '射频脉冲是MRI中用于激发原子核的电磁波，其频率与原子核的共振频率相匹配。'
        },
        { 
            id: 6, 
            name: '梯度磁场', 
            category: 2, 
            symbolSize: 25,
            description: '梯度磁场用于空间编码，通过在不同方向上施加线性变化的磁场来实现图像的空间定位。'
        },
        { 
            id: 7, 
            name: '神经系统', 
            category: 2, 
            symbolSize: 25,
            description: 'MRI在神经系统中的应用包括脑肿瘤、脑血管疾病、脑发育异常等的诊断。'
        },
        { 
            id: 8, 
            name: '肌肉骨骼', 
            category: 2, 
            symbolSize: 25,
            description: 'MRI能够清晰显示肌肉、韧带、软骨等软组织，用于关节疾病、运动损伤等的诊断。'
        },
        { 
            id: 9, 
            name: '心血管', 
            category: 2, 
            symbolSize: 25,
            description: '心脏MRI可用于评估心脏结构、功能及心肌活性，对心血管疾病的诊断有重要价值。'
        },
        { 
            id: 10, 
            name: '磁体系统', 
            category: 2, 
            symbolSize: 25,
            description: '磁体系统产生强而稳定的主磁场，是MRI设备的核心部件。'
        },
        { 
            id: 11, 
            name: '梯度系统', 
            category: 2, 
            symbolSize: 25,
            description: '梯度系统产生线性变化的梯度磁场，用于空间定位和图像编码。'
        },
        { 
            id: 12, 
            name: '射频系统', 
            category: 2, 
            symbolSize: 25,
            description: '射频系统包括发射和接收线圈，用于发射射频脉冲并接收共振信号。'
        },
        { 
            id: 13, 
            name: 'T1加权', 
            category: 3, 
            symbolSize: 20,
            description: 'T1加权图像主要反映组织的T1弛豫时间差异，适用于显示解剖结构。'
        },
        { 
            id: 14, 
            name: 'T2加权', 
            category: 3, 
            symbolSize: 20,
            description: 'T2加权图像主要反映组织的T2弛豫时间差异，对病变和水肿显示敏感。'
        },
        { 
            id: 15, 
            name: '弥散成像', 
            category: 3, 
            symbolSize: 20,
            description: '弥散加权成像反映水分子的弥散运动，对急性脑缺血等疾病有重要诊断价值。'
        },
        { 
            id: 16, 
            name: '灌注成像', 
            category: 3, 
            symbolSize: 20,
            description: '灌注成像评估组织的血流灌注情况，用于肿瘤、缺血性疾病等的评估。'
        }
    ],
    links: [
        { source: 0, target: 1 },
        { source: 0, target: 2 },
        { source: 0, target: 3 },
        { source: 1, target: 4 },
        { source: 1, target: 5 },
        { source: 1, target: 6 },
        { source: 2, target: 7 },
        { source: 2, target: 8 },
        { source: 2, target: 9 },
        { source: 3, target: 10 },
        { source: 3, target: 11 },
        { source: 3, target: 12 },
        { source: 2, target: 13 },
        { source: 2, target: 14 },
        { source: 2, target: 15 },
        { source: 2, target: 16 },
        { source: 7, target: 13 },
        { source: 7, target: 14 },
        { source: 7, target: 15 },
        { source: 7, target: 16 }
    ],
    categories: [
        { name: '核心概念' },
        { name: '主要领域' },
        { name: '基础概念' },
        { name: '成像技术' }
    ]
};

// 知识图谱初始化函数
function initKnowledgeGraph() {
    // 检查ECharts是否加载
    if (typeof echarts === 'undefined') {
        console.error('ECharts library not loaded');
        loadFallbackGraph();
        return;
    }
    
    try {
        // 初始化图表实例
        const chart = echarts.init(document.getElementById('knowledge-graph'));
        
        // 图表配置
        const option = {
            title: {
                text: '磁共振成像知识图谱',
                textStyle: {
                    color: '#db7093',
                    fontSize: 20
                },
                left: 'center'
            },
            tooltip: {
                formatter: function(params) {
                    if (params.dataType === 'node') {
                        return `<b>${params.data.name}</b><br/>${params.data.description || '点击查看详细信息'}`;
                    }
                    return `${params.data.source} → ${params.data.target}`;
                }
            },
            legend: {
                data: knowledgeData.categories.map(function (a) {
                    return a.name;
                }),
                textStyle: {
                    color: '#333'
                },
                top: 40
            },
            animationDuration: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [{
                name: '磁共振成像',
                type: 'graph',
                layout: 'force',
                data: knowledgeData.nodes.map(node => ({
                    ...node,
                    itemStyle: {
                        color: getNodeColor(node.category),
                        borderColor: '#fff',
                        borderWidth: 2,
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.3)'
                    },
                    label: {
                        show: true,
                        position: 'right',
                        formatter: '{b}',
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 20,
                            shadowColor: 'rgba(0, 0, 0, 0.8)'
                        },
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    }
                })),
                links: knowledgeData.links,
                categories: knowledgeData.categories,
                roam: true,
                focusNodeAdjacency: true,
                lineStyle: {
                    color: 'source',
                    curveness: 0.3,
                    width: 2
                },
                emphasis: {
                    focus: 'adjacency',
                    lineStyle: {
                        width: 5
                    }
                },
                force: {
                    repulsion: 1000,
                    gravity: 0.1,
                    edgeLength: 100
                }
            }]
        };
        
        // 设置图表选项
        chart.setOption(option);
        
        // 添加节点点击事件
        chart.on('click', function(params) {
            if (params.dataType === 'node') {
                showNodeDetails(params.data);
            }
        });
        
        // 添加节点鼠标悬停效果
        chart.on('mouseover', function(params) {
            if (params.dataType === 'node') {
                // 添加脉冲动画效果
                chart.dispatchAction({
                    type: 'highlight',
                    seriesIndex: 0,
                    dataIndex: params.dataIndex
                });
            }
        });
        
        chart.on('mouseout', function(params) {
            if (params.dataType === 'node') {
                // 移除高亮效果
                chart.dispatchAction({
                    type: 'downplay',
                    seriesIndex: 0,
                    dataIndex: params.dataIndex
                });
            }
        });
        
        // 响应窗口大小变化
        window.addEventListener('resize', function() {
            chart.resize();
        });
        
        // 添加自动布局动画
        setTimeout(function() {
            chart.dispatchAction({
                type: 'forceLayout',
                animation: {
                    duration: 1000,
                    easing: 'cubicInOut'
                }
            });
        }, 2000);
        
        console.log('知识图谱初始化成功');
    } catch (error) {
        console.error('知识图谱初始化失败:', error);
        loadFallbackGraph();
    }
}

// 显示节点详细信息
function showNodeDetails(node) {
    const detailsElement = document.getElementById('node-details');
    const titleElement = document.getElementById('node-title');
    const descriptionElement = document.getElementById('node-description');
    
    titleElement.textContent = node.name;
    descriptionElement.textContent = node.description;
    
    detailsElement.style.display = 'block';
    
    // 添加淡入效果
    detailsElement.style.opacity = '0';
    detailsElement.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        detailsElement.style.opacity = '1';
    }, 10);
}

// 备用图表函数
function loadFallbackGraph() {
    const container = document.getElementById('knowledge-graph');
    container.classList.add('fallback-loaded');
    
    container.innerHTML = `
        <div class="graph-placeholder">
            <h4>磁共振成像知识图谱</h4>
            <div class="mt-4">
                <div class="row text-center">
                    <div class="col-md-12 mb-4">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                核心概念
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">磁共振成像</h5>
                                <div class="d-flex justify-content-around flex-wrap mt-3">
                                    <span class="badge bg-secondary m-1">物理原理</span>
                                    <span class="badge bg-secondary m-1">临床应用</span>
                                    <span class="badge bg-secondary m-1">设备组成</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row">
                    <div class="col-md-4 mb-3">
                        <div class="card h-100">
                            <div class="card-header bg-info text-white">
                                物理原理
                            </div>
                            <div class="card-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">核磁共振</li>
                                    <li class="list-group-item">射频脉冲</li>
                                    <li class="list-group-item">梯度磁场</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4 mb-3">
                        <div class="card h-100">
                            <div class="card-header bg-success text-white">
                                临床应用
                            </div>
                            <div class="card-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">神经系统</li>
                                    <li class="list-group-item">肌肉骨骼</li>
                                    <li class="list-group-item">心血管</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-4 mb-3">
                        <div class="card h-100">
                            <div class="card-header bg-warning text-dark">
                                设备组成
                            </div>
                            <div class="card-body">
                                <ul class="list-group list-group-flush">
                                    <li class="list-group-item">磁体系统</li>
                                    <li class="list-group-item">梯度系统</li>
                                    <li class="list-group-item">射频系统</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="row mt-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header bg-dark text-white">
                                成像技术
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-around flex-wrap">
                                    <span class="badge bg-primary m-1">T1加权</span>
                                    <span class="badge bg-primary m-1">T2加权</span>
                                    <span class="badge bg-primary m-1">弥散成像</span>
                                    <span class="badge bg-primary m-1">灌注成像</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <p class="mt-4 text-muted">这是知识图谱的静态版本，交互式版本因技术原因无法加载。</p>
            <button class="btn btn-outline-primary mt-2" onclick="retryLoadGraph()">重新尝试加载交互图表</button>
        </div>
    `;
}

// 重新尝试加载图表
function retryLoadGraph() {
    const container = document.getElementById('knowledge-graph');
    container.classList.remove('fallback-loaded');
    container.innerHTML = `
        <div class="graph-placeholder">
            <h4>知识图谱加载中...</h4>
            <div class="spinner-border text-primary mb-3" role="status">
                <span class="visually-hidden">加载中...</span>
            </div>
            <p>重新尝试加载交互式图表</p>
        </div>
    `;
    
    setTimeout(initKnowledgeGraph, 1000);
}

// 根据节点类别返回颜色
function getNodeColor(category) {
    const colors = ['#ff69b4', '#db7093', '#c71585', '#ff1493'];
    return colors[category % colors.length];
}