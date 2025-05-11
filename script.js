document.addEventListener('DOMContentLoaded', async function() {
    try {
        // 确保Chart.js已完全加载
        if (typeof Chart === 'undefined') {
            throw new Error('Chart.js未能正确加载');
        }
        await new Promise(resolve => setTimeout(resolve, 100));
    const rateInput = document.getElementById('rate');
    const periodsInput = document.getElementById('periods');
    const ctx = document.getElementById('compoundChart').getContext('2d');

    // 预设的常用复利曲线数据
    const presetRates = [
        { rate: 10, label: '10%复利' },
        { rate: 20, label: '20%复利' },
        { rate: 30, label: '30%复利' }
    ];

    let chart = null;

    function calculateCompoundInterest(principal, rate, periods) {
        const data = [];
        for (let i = 0; i <= periods; i++) {
            // 计算倍数而不是具体金额
            data.push(Math.pow(1 + rate / 100, i));
        }
        return data;
    }

    function updateChart() {
        try {
            console.log('开始更新图表...');
        const rate = parseFloat(rateInput.value);
        const periods = parseInt(periodsInput.value);
        const principal = 100; // 初始本金设为100，便于百分比展示

        // 生成周期标签
        const labels = Array.from({length: periods + 1}, (_, i) => `第${i}周期`);

        // 用户输入的复利数据
        const userData = calculateCompoundInterest(principal, rate, periods);

        // 预设复利曲线数据
        const presetDatasets = presetRates.map(preset => ({
            label: preset.label,
            data: calculateCompoundInterest(principal, preset.rate, periods),
            borderColor: `rgba(${Math.random() * 150 + 50}, ${Math.random() * 150 + 50}, ${Math.random() * 150 + 50}, 0.8)`,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0
        }));

        // 销毁旧图表
        if (chart) {
            chart.destroy();
        }

        // 创建新图表
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: `用户输入 ${rate}%复利`,
                        data: userData,
                        borderColor: 'rgba(255, 0, 0, 0.8)',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        pointRadius: 0,
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(2)}倍`;
                                }
                            }
                        }
                    },
                    ...presetDatasets
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: '复利增长曲线对比图',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: '增长倍数（初始值=1）'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + '倍';
                            }
                        },
                        suggestedMax: 10 // 设置Y轴最大值为10倍
                    },
                    x: {
                        title: {
                            display: true,
                            text: '周期'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
        console.log('图表更新完成');
        } catch (error) {
            console.error('更新图表时发生错误:', error);
        }
    }

    // 监听输入变化
    rateInput.addEventListener('input', updateChart);
    periodsInput.addEventListener('input', updateChart);

        // 初始化图表
        updateChart();
    } catch (error) {
        console.error('初始化过程发生错误:', error);
    }
});