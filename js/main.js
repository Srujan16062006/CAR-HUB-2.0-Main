// Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger Menu
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && document.querySelector(href)) {
                e.preventDefault();
                document.querySelector(href).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Action bar buttons functionality
    const bookBtn = document.querySelector('.btn-book');
    const callBtn = document.querySelector('.btn-call');
    const testdriveBtn = document.querySelector('.btn-testdrive');

    if (bookBtn) {
        bookBtn.addEventListener('click', function() {
            document.getElementById('testdrive').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (testdriveBtn) {
        testdriveBtn.addEventListener('click', function() {
            document.getElementById('testdrive').scrollIntoView({
                behavior: 'smooth'
            });
        });
    }

    if (callBtn) {
        callBtn.addEventListener('click', function() {
            alert('CAR HUB (Hyderabad):\n• Jubilee Hills: Tel: +91 40 4852 9160 | srujan.jubileehills@gmail.com\n• Gachibowli: Tel: +91 40 6924 7350 | srujan.gachibowli@gmail.com\n• Banjara Hills: Tel: +91 40 2339 8470 | srujan.banjarahills@gmail.com\n• Hitec City: Tel: +91 40 6688 3590 | srujan.hiteccity@gmail.com');
        });
    }

    // Book Experience buttons
    const bookExperienceBtns = document.querySelectorAll('.btn-book-experience');
    bookExperienceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('testdrive').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ===================================================
    // EmailJS Configuration & Helper Functions
    // ===================================================
    function isPlaceholder(val) {
        return !val || typeof val !== 'string' || val.trim() === '' || val.trim().startsWith('YOUR_');
    }

    function getEmailConfig() {
        const storedUser = localStorage.getItem('carhub_emailjs_user');
        const storedService = localStorage.getItem('carhub_emailjs_service');
        const storedOwnerTpl = localStorage.getItem('carhub_emailjs_owner_template');
        const storedCustTpl = localStorage.getItem('carhub_emailjs_customer_template');
        const storedOwnerEmail = localStorage.getItem('carhub_owner_email');

        const user = storedUser || document.body.dataset.emailjsUser || '';
        const service = storedService || document.body.dataset.emailjsService || '';
        const ownerTemplate = storedOwnerTpl || document.body.dataset.emailjsOwnerTemplate || '';
        const customerTemplate = storedCustTpl || document.body.dataset.emailjsCustomerTemplate || '';
        const ownerEmail = storedOwnerEmail || document.body.dataset.ownerEmail || 'srujanlingalwar3@gmail.com';

        const areDifferent = (
            service.trim().toLowerCase() !== ownerTemplate.trim().toLowerCase() &&
            ownerTemplate.trim().toLowerCase() !== customerTemplate.trim().toLowerCase() &&
            service.trim().toLowerCase() !== customerTemplate.trim().toLowerCase() &&
            customerTemplate.trim().toLowerCase() !== ownerEmail.trim().toLowerCase() &&
            !customerTemplate.includes('@') &&
            ownerEmail.includes('@')
        );

        const isConfigured = !isPlaceholder(user) && !isPlaceholder(service) && !isPlaceholder(ownerTemplate) && !isPlaceholder(customerTemplate) && areDifferent;

        return {
            user: isPlaceholder(user) ? '' : user.trim(),
            service: isPlaceholder(service) ? '' : service.trim(),
            ownerTemplate: isPlaceholder(ownerTemplate) ? '' : ownerTemplate.trim(),
            customerTemplate: isPlaceholder(customerTemplate) ? '' : customerTemplate.trim(),
            ownerEmail: ownerEmail.trim(),
            isConfigured: isConfigured
        };
    }

    function updateEmailStatusUI() {
        const cfg = getEmailConfig();
        const dot = document.getElementById('emailStatusDot');
        const text = document.getElementById('emailStatusText');

        if (dot && text) {
            if (cfg.isConfigured) {
                dot.className = 'status-indicator status-active';
                text.innerHTML = `Email Notifications: <strong style="color: #059669;">Active</strong> (Sending to ${cfg.ownerEmail})`;
            } else {
                dot.className = 'status-indicator status-warning';
                text.innerHTML = `Email Notifications: <strong style="color: #d97706;">Not Configured</strong>`;
            }
        }

        // Initialize EmailJS if configured
        if (typeof emailjs !== 'undefined' && cfg.isConfigured && cfg.user) {
            try {
                emailjs.init(cfg.user);
            } catch (e) {
                console.warn('EmailJS init warning:', e);
            }
        }
    }

    // Initialize UI status
    updateEmailStatusUI();

    // ===================================================
    // Email Setup Modal Logic & Validation
    // ===================================================
    const modal = document.getElementById('emailSetupModal');
    const openModalBtn = document.getElementById('openEmailSetupBtn');
    const closeModalBtn = document.getElementById('closeEmailModal');
    const emailConfigForm = document.getElementById('emailConfigForm');
    const testEmailBtn = document.getElementById('testEmailCfgBtn');
    const clearEmailBtn = document.getElementById('clearEmailCfgBtn');
    const feedbackEl = document.getElementById('emailTestFeedback');

    function clearModalValidationErrors() {
        const inputs = [
            document.getElementById('cfgEmailjsUser'),
            document.getElementById('cfgEmailjsService'),
            document.getElementById('cfgEmailjsOwnerTemplate'),
            document.getElementById('cfgEmailjsCustomerTemplate'),
            document.getElementById('cfgOwnerEmail')
        ];
        inputs.forEach(inp => {
            if (inp) inp.classList.remove('is-invalid');
        });
    }

    function validateEmailCredentials(user, service, ownerTpl, custTpl, ownerEmail, isTest) {
        clearModalValidationErrors();
        const userInp = document.getElementById('cfgEmailjsUser');
        const srvInp = document.getElementById('cfgEmailjsService');
        const ownTplInp = document.getElementById('cfgEmailjsOwnerTemplate');
        const custTplInp = document.getElementById('cfgEmailjsCustomerTemplate');
        const ownMailInp = document.getElementById('cfgOwnerEmail');

        if (!user) {
            if (userInp) userInp.classList.add('is-invalid');
            return 'Public Key (User ID) is required.';
        }
        if (!service) {
            if (srvInp) srvInp.classList.add('is-invalid');
            return 'Service ID is required.';
        }
        if (!ownerTpl) {
            if (ownTplInp) ownTplInp.classList.add('is-invalid');
            return 'Owner Alert Template ID is required.';
        }
        if (!isTest && !custTpl) {
            if (custTplInp) custTplInp.classList.add('is-invalid');
            return 'Customer Confirmation Template ID is required.';
        }

        // Rule 1: Service ID and Owner Template ID must be different!
        if (service.toLowerCase() === ownerTpl.toLowerCase()) {
            if (srvInp) srvInp.classList.add('is-invalid');
            if (ownTplInp) ownTplInp.classList.add('is-invalid');
            return '❌ Service ID and Owner Template ID must be different! Service ID connects to your email service (e.g. service_xxxx), while Owner Template ID is your template layout (e.g. template_xxxx).';
        }

        // Rule 2: Customer Confirmation Template ID and Dealership Notification Email must be different!
        if (custTpl) {
            if (custTpl.toLowerCase() === ownerEmail.toLowerCase() || custTpl.includes('@')) {
                if (custTplInp) custTplInp.classList.add('is-invalid');
                if (ownMailInp) ownMailInp.classList.add('is-invalid');
                return '❌ Customer Confirmation Template ID and Dealership Notification Email must be different! Customer Confirmation Template ID must be an EmailJS Template ID (e.g. template_xxxx), NOT an email address.';
            }

            // Rule 3: Owner Template ID and Customer Confirmation Template ID must be different!
            if (ownerTpl.toLowerCase() === custTpl.toLowerCase()) {
                if (ownTplInp) ownTplInp.classList.add('is-invalid');
                if (custTplInp) custTplInp.classList.add('is-invalid');
                return '❌ Owner Alert Template ID and Customer Confirmation Template ID must be different! One sends booking leads to the dealership, and the other sends a thank-you confirmation to the customer.';
            }

            // Rule 4: Service ID and Customer Confirmation Template ID must be different!
            if (service.toLowerCase() === custTpl.toLowerCase()) {
                if (srvInp) srvInp.classList.add('is-invalid');
                if (custTplInp) custTplInp.classList.add('is-invalid');
                return '❌ Service ID and Customer Confirmation Template ID must be different!';
            }
        }

        // Rule 5: Dealership Notification Email must be a valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(ownerEmail) || ownerEmail.startsWith('template_') || ownerEmail.startsWith('service_')) {
            if (ownMailInp) ownMailInp.classList.add('is-invalid');
            return '❌ Dealership Notification Email must be a valid email address (e.g. srujanlingalwar3@gmail.com), NOT a template or service ID.';
        }

        return null;
    }

    function openEmailModal() {
        if (!modal) return;
        clearModalValidationErrors();
        const cfg = getEmailConfig();
        const userInp = document.getElementById('cfgEmailjsUser');
        const srvInp = document.getElementById('cfgEmailjsService');
        const ownTplInp = document.getElementById('cfgEmailjsOwnerTemplate');
        const custTplInp = document.getElementById('cfgEmailjsCustomerTemplate');
        const ownMailInp = document.getElementById('cfgOwnerEmail');

        if (userInp) userInp.value = cfg.user;
        if (srvInp) srvInp.value = cfg.service;
        if (ownTplInp) ownTplInp.value = cfg.ownerTemplate;
        if (custTplInp) custTplInp.value = cfg.customerTemplate;
        if (ownMailInp) ownMailInp.value = cfg.ownerEmail || 'srujanlingalwar3@gmail.com';

        if (feedbackEl) {
            feedbackEl.style.display = 'none';
            feedbackEl.textContent = '';
        }

        modal.style.display = 'flex';
    }

    function closeEmailModal() {
        if (modal) modal.style.display = 'none';
        clearModalValidationErrors();
    }

    if (openModalBtn) openModalBtn.addEventListener('click', openEmailModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeEmailModal);
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeEmailModal();
        });
    }

    // Save EmailJS Configuration
    if (emailConfigForm) {
        emailConfigForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const user = document.getElementById('cfgEmailjsUser').value.trim();
            const service = document.getElementById('cfgEmailjsService').value.trim();
            const ownerTpl = document.getElementById('cfgEmailjsOwnerTemplate').value.trim();
            const custTpl = document.getElementById('cfgEmailjsCustomerTemplate').value.trim();
            const ownerEmail = document.getElementById('cfgOwnerEmail').value.trim() || 'srujanlingalwar3@gmail.com';

            const validationError = validateEmailCredentials(user, service, ownerTpl, custTpl, ownerEmail, false);
            if (validationError) {
                if (feedbackEl) {
                    feedbackEl.className = 'test-feedback error';
                    feedbackEl.style.display = 'block';
                    feedbackEl.textContent = validationError;
                }
                return;
            }

            localStorage.setItem('carhub_emailjs_user', user);
            localStorage.setItem('carhub_emailjs_service', service);
            localStorage.setItem('carhub_emailjs_owner_template', ownerTpl);
            localStorage.setItem('carhub_emailjs_customer_template', custTpl);
            localStorage.setItem('carhub_owner_email', ownerEmail);

            updateEmailStatusUI();

            if (feedbackEl) {
                feedbackEl.className = 'test-feedback success';
                feedbackEl.style.display = 'block';
                feedbackEl.textContent = 'Configuration saved and activated successfully!';
            }

            setTimeout(function() {
                closeEmailModal();
            }, 1200);
        });
    }

    // Reset Configuration
    if (clearEmailBtn) {
        clearEmailBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear saved EmailJS settings?')) {
                localStorage.removeItem('carhub_emailjs_user');
                localStorage.removeItem('carhub_emailjs_service');
                localStorage.removeItem('carhub_emailjs_owner_template');
                localStorage.removeItem('carhub_emailjs_customer_template');
                localStorage.removeItem('carhub_owner_email');

                const userInp = document.getElementById('cfgEmailjsUser');
                const srvInp = document.getElementById('cfgEmailjsService');
                const ownTplInp = document.getElementById('cfgEmailjsOwnerTemplate');
                const custTplInp = document.getElementById('cfgEmailjsCustomerTemplate');
                const ownMailInp = document.getElementById('cfgOwnerEmail');

                if (userInp) userInp.value = '';
                if (srvInp) srvInp.value = '';
                if (ownTplInp) ownTplInp.value = '';
                if (custTplInp) custTplInp.value = '';
                if (ownMailInp) ownMailInp.value = 'srujanlingalwar3@gmail.com';

                clearModalValidationErrors();
                updateEmailStatusUI();

                if (feedbackEl) {
                    feedbackEl.className = 'test-feedback error';
                    feedbackEl.style.display = 'block';
                    feedbackEl.textContent = 'Configuration reset. Email notifications are now disabled.';
                }
            }
        });
    }

    // Send Test Email
    if (testEmailBtn) {
        testEmailBtn.addEventListener('click', function() {
            const user = document.getElementById('cfgEmailjsUser').value.trim();
            const service = document.getElementById('cfgEmailjsService').value.trim();
            const ownerTpl = document.getElementById('cfgEmailjsOwnerTemplate').value.trim();
            const custTpl = document.getElementById('cfgEmailjsCustomerTemplate').value.trim();
            const ownerEmail = document.getElementById('cfgOwnerEmail').value.trim() || 'srujanlingalwar3@gmail.com';

            const validationError = validateEmailCredentials(user, service, ownerTpl, custTpl, ownerEmail, true);
            if (validationError) {
                if (feedbackEl) {
                    feedbackEl.className = 'test-feedback error';
                    feedbackEl.style.display = 'block';
                    feedbackEl.textContent = validationError;
                }
                return;
            }

            if (typeof emailjs === 'undefined') {
                if (feedbackEl) {
                    feedbackEl.className = 'test-feedback error';
                    feedbackEl.style.display = 'block';
                    feedbackEl.textContent = 'EmailJS SDK could not be loaded. Please check your internet connection.';
                }
                return;
            }

            if (feedbackEl) {
                feedbackEl.className = 'test-feedback loading';
                feedbackEl.style.display = 'block';
                feedbackEl.textContent = 'Sending test email to ' + ownerEmail + '...';
            }

            try {
                emailjs.init(user);
            } catch(e) {}

            const testParams = {
                owner_email: ownerEmail,
                customer_name: 'Test Customer',
                customer_email: 'test@example.com',
                customer_mobile: '9876543210',
                model: 'THE TOYOTA SUPRA MK5',
                branch: 'HYDERABAD - JUBILEE HILLS',
                finance_interest: 'Yes',
                submitted_at: new Date().toLocaleString()
            };

            emailjs.send(service, ownerTpl, testParams)
                .then(function() {
                    if (feedbackEl) {
                        feedbackEl.className = 'test-feedback success';
                        feedbackEl.style.display = 'block';
                        feedbackEl.textContent = 'Success! Test email was sent to ' + ownerEmail + '. Please check your inbox (and spam folder).';
                    }
                })
                .catch(function(err) {
                    console.error('Test email failed:', err);
                    if (feedbackEl) {
                        feedbackEl.className = 'test-feedback error';
                        feedbackEl.style.display = 'block';
                        feedbackEl.textContent = 'Test failed: ' + (err.text || err.message || JSON.stringify(err)) + '. Verify IDs in EmailJS dashboard.';
                    }
                });
        });
    }

    // ===================================================
    // Test Drive Form Submission
    // ===================================================
    const testdriveForm = document.querySelector('.testdrive-form');
    if (testdriveForm) {
        testdriveForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Validation
            if (!data['first-name'] || !data['email'] || !data['mobile']) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data['email'])) {
                alert('Please enter a valid email address.');
                return;
            }

            // Phone validation
            const phoneDigits = data['mobile'].replace(/\D/g, '');
            if (phoneDigits.length !== 10) {
                alert('Please enter a valid 10-digit mobile number.');
                return;
            }

            const cfg = getEmailConfig();

            // Prepare email parameters
            const fullName = `${data['salutation'] ? data['salutation'] + ' ' : ''}${data['first-name']} ${data['last-name'] || ''}`.trim();
            const templateParamsOwner = {
                owner_email: cfg.ownerEmail,
                customer_name: fullName,
                customer_email: data['email'],
                customer_mobile: data['mobile'],
                model: data['model'] || 'Selected Model',
                branch: data['branch'] || 'Hyderabad Branch',
                finance_interest: formData.get('finance-interest') ? 'Yes' : 'No',
                submitted_at: new Date().toLocaleString()
            };

            const templateParamsCustomer = {
                to_email: data['email'],
                to_name: fullName,
                model: data['model'] || 'Selected Model',
                branch: data['branch'] || 'Hyderabad Branch',
                support_email: cfg.ownerEmail
            };

            const submitButton = this.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.textContent : '';

            // Disable form and show loading state
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting & Sending...';
            }

            if (typeof emailjs !== 'undefined' && cfg.isConfigured) {
                try {
                    emailjs.init(cfg.user);
                } catch(e) {}

                // Send email to owner first
                emailjs.send(cfg.service, cfg.ownerTemplate, templateParamsOwner)
                    .then(function() {
                        console.log('Owner notification email sent successfully');
                        // Then send thank-you email to customer
                        return emailjs.send(cfg.service, cfg.customerTemplate, templateParamsCustomer);
                    })
                    .then(function() {
                        console.log('Customer confirmation email sent successfully');
                        alert(`🎉 Test Drive Booked Successfully!\n\nThank you, ${data['first-name']}!\nYour appointment request for ${data['model']} has been confirmed.\n\n• Dealership alert sent to: ${cfg.ownerEmail}\n• Confirmation email sent to: ${data['email']}\n\nOur representative will contact you shortly.`);
                        testdriveForm.reset();
                    })
                    .catch(function(error) {
                        console.error('Email sending failed:', error);
                        if (error && (error.status === 200 || error.text === 'OK')) {
                            alert(`Your request was received and the dealership has been notified at ${cfg.ownerEmail}. However, we could not deliver the confirmation email to ${data['email']}. Please verify your email.`);
                        } else {
                            alert(`There was an issue sending your email notifications: ${error.text || error.message || 'Server error'}.\n\nPlease check your EmailJS configuration or contact us directly.`);
                        }
                    })
                    .finally(function() {
                        if (submitButton) {
                            submitButton.disabled = false;
                            submitButton.textContent = originalButtonText;
                        }
                    });
            } else {
                // EmailJS not configured
                console.warn('Email notifications are not configured.');
                const wantsSetup = confirm(`Thank you, ${data['first-name']}!\nYour test drive appointment request has been recorded locally.\n\n⚠️ Notice: Email notifications are not configured yet.\n\nWould you like to open the EmailJS Setup panel now to enter your keys? (Or refer to EMAIL_SETUP_GUIDE.md)`);
                
                testdriveForm.reset();
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = originalButtonText;
                }

                if (wantsSetup) {
                    openEmailModal();
                }
            }
        });

        // --- Dry-run helper: simulate a submission when ?dryrun=1 is present in the URL
        function runDryRun() {
            const cfg = getEmailConfig();
            console.info('Dry-run: Simulating a test-drive submission (no real emails will be sent).');

            const sample = {
                'salutation': 'Mr.',
                'first-name': 'Test',
                'last-name': 'User',
                'email': 'test@example.com',
                'mobile': '9999999999',
                'model': 'THE BMW X7',
                'branch': 'HYDERABAD - JUBILEE HILLS'
            };

            const fullName = `${sample['salutation']} ${sample['first-name']} ${sample['last-name']}`;
            const templateParamsOwner = {
                owner_email: cfg.ownerEmail,
                customer_name: fullName,
                customer_email: sample['email'],
                customer_mobile: sample['mobile'],
                model: sample['model'],
                branch: sample['branch'],
                finance_interest: 'Yes',
                submitted_at: new Date().toLocaleString()
            };

            const templateParamsCustomer = {
                to_email: sample['email'],
                to_name: fullName,
                model: sample['model'],
                branch: sample['branch'],
                support_email: cfg.ownerEmail
            };

            console.group('Dry-run: Email Targets & Payloads');
            console.log('Owner email target:', templateParamsOwner.owner_email);
            console.log('Customer email target:', templateParamsCustomer.to_email);
            console.log('Owner template payload:', templateParamsOwner);
            console.log('Customer template payload:', templateParamsCustomer);
            console.log('Active EmailJS config:', cfg);
            console.groupEnd();

            alert('Dry-run complete: check Developer Console (F12) for the intended email addresses and payloads. No emails were sent.');
        }

        if (window.location.search.includes('dryrun=1')) {
            setTimeout(runDryRun, 200);
        }
    }

    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) {
        const btn = document.createElement('div');
        btn.className = 'back-to-top';
        btn.innerHTML = '↑';
        document.body.appendChild(btn);

        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        });

        btn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

    }
});


// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-item');
const totalSlides = slides.length;

function showSlide(n) {
    // Remove active class from all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Add active class to current slide
    if (slides[currentSlide]) {
        slides[currentSlide].classList.add('active');
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    // Set initial slide
    showSlide(currentSlide);

    // Setup carousel buttons
    const nextBtn = document.getElementById('carouselNext');
    const prevBtn = document.getElementById('carouselPrev');

    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    // Auto advance carousel every 5 seconds
    setInterval(nextSlide, 5000);

    // Keyboard navigation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowRight') {
            nextSlide();
        } else if (event.key === 'ArrowLeft') {
            prevSlide();
        }
    });
});
