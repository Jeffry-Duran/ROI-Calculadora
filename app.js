document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('roiForm');
    const resultsSection = document.getElementById('results');
    const placeholderSection = document.getElementById('placeholder');
    const formResetBtn = document.getElementById('formResetBtn');
    const formResetBtnContainer = document.getElementById('formResetBtnContainer');
    let roiChart = null;

    // Función para manejar la visibilidad del placeholder
    function updatePlaceholderVisibility() {
        if (window.innerWidth >= 1024 && resultsSection.classList.contains('hidden')) {
            placeholderSection.style.display = 'block'; // Asegurar que se muestre en PC
        } else {
            placeholderSection.style.display = 'none'; // Ocultarlo en cualquier otro caso
        }
    }
    updatePlaceholderVisibility(); // Ejecutar al cargar la página

    // Calcular ROI
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const budget = parseFloat(document.getElementById('budget').value);
        const returnValue = parseFloat(document.getElementById('return').value);
        const months = parseInt(document.getElementById('months').value);
        
        if (isNaN(budget) || isNaN(returnValue) || isNaN(months) || months < 1) {
            alert('Por favor ingresa valores válidos');
            return;
        }
        
        const totalInvestment = budget * months;
        const totalReturn = returnValue * months;
        const roiPercentage = ((totalReturn - totalInvestment) / totalInvestment * 100).toFixed(1);
        
        document.getElementById('totalInvestment').textContent = '$' + totalInvestment.toLocaleString('en-US');
        document.getElementById('totalReturn').textContent = '$' + totalReturn.toLocaleString('en-US');
        document.getElementById('roiPercentage').textContent = roiPercentage + '%';

        
        generateChart(totalInvestment, totalReturn, months);
        
        // ** Forzar ocultar placeholder en cualquier caso**
        placeholderSection.style.display = 'none';

        // Mostrar resultados con animación
        resultsSection.classList.remove('hidden');
        resultsSection.style.opacity = '0';
        resultsSection.style.transform = 'translateY(-20px)';
        void resultsSection.offsetWidth;
        resultsSection.style.opacity = '1';
        resultsSection.style.transform = 'translateY(0)';
        resultsSection.style.transition = 'all 0.5s ease-out';
        
        // Mostrar botón de nuevo cálculo
        formResetBtnContainer.classList.remove('hidden');

        // Scroll en mobile
        if (window.innerWidth < 1024) {
            setTimeout(() => resultsSection.scrollIntoView({ behavior: 'smooth' }), 500);
        }
    });

    function generateChart(investment, returnAmount, months) {
        const ctx = document.getElementById('roiChart').getContext('2d');
        
        if (roiChart) roiChart.destroy();
        
        const currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        
        const labels = [];
        for (let i = 0; i < months; i++) {
            const monthIndex = (currentMonth + i) % 12;
            const year = currentYear + Math.floor((currentMonth + i) / 12);
            labels.push(`${monthNames[monthIndex]} ${year}`);
        }
        
        const investmentData = Array.from({ length: months }, (_, i) => (investment / months) * (i + 1));
        const returnData = Array.from({ length: months }, (_, i) => (returnAmount / months) * (i + 1));

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
                    legend: { position: 'top' },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: (context) => `${context.dataset.label}: $${context.raw.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => `$${value.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    // Resetear formulario
    formResetBtn.addEventListener('click', function() {
        form.reset();
        resultsSection.classList.add('hidden');
        formResetBtnContainer.classList.add('hidden');

        // 🔥 **Forzar a mostrar el placeholder solo en PC**
        updatePlaceholderVisibility();
        
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
    window.addEventListener('resize', updatePlaceholderVisibility);
});
