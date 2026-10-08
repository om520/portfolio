from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.clickjacking import xframe_options_sameorigin
from django.views.decorators.csrf import csrf_exempt
from django.core.mail import send_mail
from django.conf import settings
import json


def index(request):
    """Render the main portfolio page with all data context."""
    context = {
        'name': 'Om Mishra',
        'title': 'Researcher · AI/ML Engineer · Innovator',
        'bio': (
            'Multidisciplinary researcher working at the intersection of '
            'astrophysics, quantum computing, and artificial intelligence. '
            'Passionate about building systems that push the boundaries of science '
            'and technology — from predicting quasar redshifts with machine learning '
            'to developing quantum sensing techniques and space debris remediation systems.'
        ),
        'linkedin': 'https://www.linkedin.com/in/om-mishra-1b1704294/',
        'github': 'https://github.com/om520',
        'email': 'om@example.com',
        'research': [
            {
                'title': 'Research Collaborator',
                'organization': 'Telecom Paris, LTCI–INFRES',
                'affiliation': 'Institut Polytechnique de Paris',
                'duration': 'Apr 2025 – Sep 2025',
                'mentor': 'Sathwik Narkedimilli',
                'description': (
                    'Contributed to astrophysics research on quasar redshift prediction '
                    'using machine learning and galaxy interaction classification. '
                    'Developed novel approaches combining spectroscopic analysis with deep learning.'
                ),
                'icon': 'telescope',
            },
            {
                'title': 'Research Collaborator',
                'organization': 'DRDO Young Scientists Laboratory',
                'affiliation': 'Defence Research and Development Organisation',
                'duration': 'Apr 2025 – Sep 2025',
                'description': (
                    'Collaborated on defense-oriented research projects involving quasar '
                    'redshift prediction methodologies. Applied advanced machine learning '
                    'techniques for astronomical data analysis.'
                ),
                'icon': 'shield',
            },
            {
                'title': 'Research Intern',
                'organization': 'Quantum Computing & Sensing Lab',
                'affiliation': 'IISER Bhopal',
                'duration': 'May 2025 – Jul 2025',
                'description': (
                    'Worked on NV-center quantum sensing including CW-ODMR, Rabi oscillations, '
                    'Ramsey interferometry, and pulsed hyperfine measurements. '
                    'Developed U-Net based spectral dip labeling models.'
                ),
                'icon': 'atom',
            },
            {
                'title': 'Co-founder & Technical Lead',
                'organization': 'Sphuranex Pvt Ltd',
                'affiliation': 'Healthcare Technology Startup',
                'duration': 'Jan 2025 – Present',
                'description': (
                    'Leading development of an automated CPR device integrating hardware R&D '
                    'with computer vision and LiDAR-based monitoring systems. '
                    'Driving innovation in emergency medical technology.'
                ),
                'icon': 'heartbeat',
            },
        ],
        'publications': [
            {
                'title': 'Quasar Redshift Prediction',
                'venue': 'ScienceDirect',
                'year': '2025',
                'url': 'https://www.sciencedirect.com/science/article/pii/S1877050926018545',
                'description': (
                    'Machine learning approach for predicting quasar redshifts from '
                    'spectroscopic data, advancing automated astronomical analysis.'
                ),
                'tags': ['Astrophysics', 'Machine Learning', 'Spectroscopy'],
            },
            {
                'title': 'Galaxy Interaction Prediction',
                'venue': 'arXiv',
                'year': '2025',
                'url': 'https://arxiv.org/abs/2601.08872',
                'description': (
                    'Deep learning framework for classifying and predicting galaxy '
                    'interactions from observational data.'
                ),
                'tags': ['Deep Learning', 'Astrophysics', 'Classification'],
            },
            {
                'title': 'Solar-Powered Ion Propulsion & Space Debris Remediation',
                'venue': 'arXiv',
                'year': '2025',
                'url': 'https://arxiv.org/abs/2601.12830',
                'description': (
                    'Novel system design for space debris removal using solar-powered '
                    'ion propulsion technology.'
                ),
                'tags': ['Space Engineering', 'Propulsion', 'Orbital Mechanics'],
            },
            {
                'title': 'Q-EVGuard',
                'venue': 'In Preparation',
                'year': '2025',
                'url': None,
                'description': (
                    'Research project currently under development — paper forthcoming.'
                ),
                'tags': ['Quantum Computing', 'Security'],
            },
            {
                'title': 'Multi-Objective Drawdown-Adaptive Ising Hamiltonian Portfolio Optimization',
                'venue': 'Quantitative Strategy Research',
                'year': '2026',
                'url': None,
                'description': (
                    'A multi-objective drawdown-adaptive Ising Hamiltonian framework for intraday '
                    'equity allocation, featuring rolling ridge-regression alpha forecasts and '
                    'simulated annealing.'
                ),
                'tags': ['Quantum-Inspired', 'Portfolio Optimization', 'Machine Learning'],
            },
        ],
        'projects': [
            {
                'title': 'EEG BioEnsemble: Clinical Seizure Detection Pipeline',
                'url': 'https://github.com/om520/EEG_BioEnsemble',
                'description': (
                    'A biologically-grounded deep learning pipeline for detecting epileptic seizures '
                    'from continuous scalp EEG data (CHB-MIT). Employs a dual-branch architecture combining '
                    'a deep ensemble (1D ResNet, EEG Transformer, 1D U-Net) with a deterministic Biomarker Engine '
                    '(spectral PSD, EMG/EOG artifact rejection gates, and baseline contrast) to prevent clinical false positives.'
                ),
                'tags': ['Deep Learning', 'PyTorch', 'Clinical EEG', 'Transformers', 'Signal Processing'],
            },
            {
                'title': 'Ising Portfolio Optimization',
                'url': 'https://github.com/om520/portfolio-optimization-using-Ising-model-model',
                'description': (
                    'A research-style Python repository for portfolio optimization using an Ising model, '
                    'with a practical bridge from correlation-based interaction matrices to Hamiltonian '
                    'minimization and trade simulation.'
                ),
                'tags': ['Quant Finance', 'Ising Model', 'Python', 'Optimization'],
            },
            {
                'title': 'CPU-Efficient Radiology LLM Pipeline',
                'url': 'https://github.com/om520/cpu-efficient-radiology-llm',
                'description': (
                    'An optimized pipeline for running large language models on CPU-only '
                    'infrastructure for radiology report generation and analysis, making '
                    'AI-assisted diagnostics accessible without GPU hardware.'
                ),
                'tags': ['LLM', 'Healthcare', 'NLP', 'Optimization'],
            },
            {
                'title': 'Multimodal Compliance QA Pipeline',
                'url': 'https://github.com/om520/Multimodal-Compliance-QA-Pipeline',
                'description': (
                    'A multimodal question-answering system for regulatory compliance, '
                    'combining text and visual document analysis for automated compliance checks.'
                ),
                'tags': ['Multimodal AI', 'NLP', 'Computer Vision', 'QA'],
            },
            {
                'title': 'Generative AI Weather-Advisory Support Bot',
                'url': 'https://github.com/om520/weather_advisory_bot',
                'description': (
                    'An intelligent weather advisory chatbot leveraging generative AI '
                    'to provide context-aware weather insights and recommendations.'
                ),
                'tags': ['Generative AI', 'Chatbot', 'Weather', 'API'],
            },
        ],
    }
    return render(request, 'main/index.html', context)


@csrf_exempt
@require_POST
def contact_form(request):
    """Handle contact form submissions via AJAX."""
    try:
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '')
        message = data.get('message', '')

        if not all([name, email, message]):
            return JsonResponse({'success': False, 'error': 'All fields are required.'}, status=400)

        subject = f"Portfolio Contact Form: {name}"
        email_message = f"New message from your portfolio website!\n\nName: {name}\nEmail: {email}\n\nMessage:\n{message}"
        
        try:
            send_mail(
                subject,
                email_message,
                settings.EMAIL_HOST_USER,
                ['ommishra052@gmail.com'],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")
            return JsonResponse({'success': False, 'error': 'Failed to send email. Server configuration error.'}, status=500)

        return JsonResponse({'success': True, 'message': 'Thank you! I will get back to you soon.'})

    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'error': 'Invalid request.'}, status=400)


@xframe_options_sameorigin
def portfolio_map(request):
    """Render the interactive portfolio research & knowledge map."""
    return render(request, 'main/map.html')

