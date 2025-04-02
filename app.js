document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const form = document.getElementById('roiForm');
    const resultsSection = document.getElementById('results');
    const placeholderSection = document.getElementById('placeholder');
    const formResetBtn = document.getElementById('formResetBtn');
    const formResetBtnContainer = document.getElementById('formResetBtnContainer');
    const infoBtn = document.getElementById('infoBtn');
    const infoModal = document.getElementById('infoModal');
    const closeModal = document.getElementById('closeModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    let roiChart = null;

    // Mostrar placeholder en desktop al cargar
    if (window.innerWidth >= 1024) {
        placeholderSection.classList.remove('hidden');
    }

    // Calcular ROI
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const budget = parseFloat(document.getElementById('budget').value);
        const returnValue = parseFloat(document.getElementById('return').value);
        const months = parseInt(document.getElementById('months').value);
        
        // Validaciones
        if (isNaN(budget)) {
            alert('Por favor ingresa un presupuesto válido');
            return;
        }
        
        if (isNaN(returnValue)) {
            alert('Por favor ingresa un retorno válido');
            return;
        }
        
        if (isNaN(months)) {
            alert('Por favor ingresa un número de meses válido');
            return;
        }
        
        if (months < 1) {
            alert('El número de meses debe ser al menos 1');
            return;
        }
        
        // Cálculos base
        const totalInvestment = budget * months;
        const totalReturn = returnValue * months;
        const roiPercentage = ((totalReturn - totalInvestment) / totalInvestment * 100).toFixed(1);
        
        // Mostrar resultados
        document.getElementById('totalInvestment').textContent = '$' + totalInvestment.toLocaleString();
        document.getElementById('totalReturn').textContent = '$' + totalReturn.toLocaleString();
        document.getElementById('roiPercentage').textContent = roiPercentage + '%';
        
        // Generar gráfico
        generateChart(totalInvestment, totalReturn, months);
        
        // Preparar animación
        resultsSection.style.opacity = '0';
        resultsSection.style.transform = 'translateY(-20px)';
        resultsSection.classList.remove('hidden');
        
        // Forzar reflow para que la animación funcione
        void resultsSection.offsetWidth;
        
        // Aplicar animación
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
        resultsSection.style.transition = 'all 0.5s ease-out';
        
        // Ocultar placeholder
        placeholderSection.classList.add('hidden');
        
        // Mostrar botón de nuevo cálculo
        formResetBtnContainer.classList.remove('hidden');
        
        // Desplazar hacia los resultados en mobile
        if (window.innerWidth < 1024) {
            setTimeout(() => {
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    });
    
    // Generar gráfico con meses reales
    function generateChart(investment, returnAmount, months) {
        const ctx = document.getElementById('roiChart').getContext('2d');
        
        if (roiChart) {
            roiChart.destroy();
        }
        
        // Obtener fecha actual
        const currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        
        // Nombres de meses en español
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                          "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        // Generar etiquetas con meses reales
        const labels = [];
        for (let i = 0; i < months; i++) {
            const monthIndex = (currentMonth + i) % 12;
            const year = currentYear + Math.floor((currentMonth + i) / 12);
            labels.push(`${monthNames[monthIndex]} ${year}`);
        }
        
        // Generar datos de inversión y retorno
        const investmentData = [];
        const returnData = [];
        
        for (let i = 1; i <= months; i++) {
            investmentData.push((investment / months) * i);
            returnData.push((returnAmount / months) * i);
        }
        
        roiChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Inversión',
                        data: investmentData,
                        borderColor: '#6366F1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: 'Retorno',
                        data: returnData,
                        borderColor: '#10B981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.raw.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Resetear desde el botón en el formulario
    formResetBtn.addEventListener('click', function() {
        form.reset();
        resultsSection.classList.add('hidden');
        formResetBtnContainer.classList.add('hidden');
        
        if (window.innerWidth >= 1024) {
            placeholderSection.classList.remove('hidden');
        }
        
        if (roiChart) {
            roiChart.destroy();
            roiChart = null;
        }
    });

    // Modal de información
    infoBtn.addEventListener('click', function() {
        infoModal.classList.remove('hidden');
    });

    [closeModal, closeModalBtn].forEach(btn => {
        btn.addEventListener('click', function() {
            infoModal.classList.add('hidden');
        });
    });

    // Cerrar modal al hacer clic fuera
    infoModal.addEventListener('click', function(e) {
        if (e.target === infoModal) {
            infoModal.classList.add('hidden');
        }
    });

    // Manejar cambios de tamaño de pantalla
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024 && resultsSection.classList.contains('hidden')) {
            placeholderSection.classList.remove('hidden');
        } else if (window.innerWidth < 1024) {
            placeholderSection.classList.add('hidden');
        }
    });
});