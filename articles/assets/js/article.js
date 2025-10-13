// Enhanced article functionality with MathJax and PDF export
class ProfessionalArticle {
    constructor() {
        this.articleId = this.generateArticleId();
        this.init();
    }

    init() {
        this.loadMathJax();
        this.setupPDFExport();
        this.setupPrintButton();
        this.setupScrollProgress();
        this.setupCopyCodeBlocks();
        this.setupReadTime();
        this.setupTableOfContents();
        console.log('Professional Article System Initialized');
    }

    generateArticleId() {
        return 'article-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    loadMathJax() {
        if (typeof window.MathJax === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://polyfill.io/v3/polyfill.min.js?features=es6';
            document.head.appendChild(script);

            const mathJaxScript = document.createElement('script');
            mathJaxScript.id = 'MathJax-script';
            mathJaxScript.async = true;
            mathJaxScript.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
            mathJaxScript.onload = () => {
                window.MathJax = {
                    tex: {
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true,
                        processEnvironments: true
                    },
                    options: {
                        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'],
                        renderActions: {
                            addMenu: [0, '', '']
                        }
                    },
                    startup: {
                        pageReady: () => {
                            return window.MathJax.startup.defaultPageReady().then(() => {
                                console.log('MathJax rendering complete');
                                this.highlightEquations();
                            });
                        }
                    }
                };
            };
            document.head.appendChild(mathJaxScript);
        }
    }

    highlightEquations() {
        document.querySelectorAll('.equation').forEach((eq, index) => {
            const eqNumber = document.createElement('span');
            eqNumber.className = 'equation-number';
            eqNumber.textContent = `(${index + 1})`;
            eq.appendChild(eqNumber);
        });
    }

    setupPDFExport() {
        const downloadBtn = document.getElementById('download-pdf');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.generatePDF();
            });
        }
    }

    async generatePDF() {
        try {
            // Show loading state
            const originalText = document.getElementById('download-pdf').innerHTML;
            document.getElementById('download-pdf').innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Generating PDF...';
            
            // Create a print-friendly version
            const printWindow = window.open('', '_blank');
            const articleContent = document.querySelector('.article-content').cloneNode(true);
            
            // Enhance for printing
            this.prepareForPrint(articleContent);
            
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>${document.title}</title>
                    <style>
                        body { 
                            font-family: 'Times New Roman', serif; 
                            line-height: 1.4; 
                            color: #000; 
                            max-width: 210mm; 
                            margin: 20mm; 
                            font-size: 12pt;
                        }
                        h1, h2, h3, h4 { color: #000; }
                        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
                        th, td { border: 1px solid #000; padding: 0.5rem; text-align: center; }
                        .equation { text-align: center; margin: 1rem 0; padding: 1rem; background: #f8f8f8; }
                        .professional-header { text-align: center; margin-bottom: 2rem; border-bottom: 2px solid #000; }
                        @media print { 
                            body { margin: 15mm; }
                            .page-break { page-break-before: always; }
                        }
                    </style>
                </head>
                <body>
                    ${articleContent.innerHTML}
                    <script>
                        window.onload = function() {
                            window.print();
                            setTimeout(() => window.close(), 1000);
                        };
                    </script>
                </body>
                </html>
            `);
            
            printWindow.document.close();
            
        } catch (error) {
            console.error('PDF generation failed:', error);
            this.showNotification('Failed to generate PDF. Please try printing the page instead.', 'error');
        } finally {
            // Restore button text
            setTimeout(() => {
                document.getElementById('download-pdf').innerHTML = originalText;
            }, 2000);
        }
    }

    prepareForPrint(content) {
        // Remove interactive elements
        content.querySelectorAll('.download-section, nav, footer').forEach(el => el.remove());
        
        // Add page breaks
        const sections = content.querySelectorAll('.section');
        sections.forEach((section, index) => {
            if (index > 0 && index % 3 === 0) {
                const pageBreak = document.createElement('div');
                pageBreak.className = 'page-break';
                section.parentNode.insertBefore(pageBreak, section);
            }
        });
    }

    setupPrintButton() {
        const printBtn = document.getElementById('print-article');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }
    }

    setupScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'fixed top-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 z-50 transition-all duration-100 shadow-lg';
        progressBar.id = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
            
            progressBar.style.width = scrollPercent + '%';
        });
    }

    setupCopyCodeBlocks() {
        document.querySelectorAll('pre').forEach((preElement) => {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
            copyButton.className = 'absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-sm transition-all duration-200 opacity-0 group-hover:opacity-100 transform hover:scale-110';
            copyButton.title = 'Copy code';
            
            const preWrapper = document.createElement('div');
            preWrapper.className = 'relative group';
            preElement.parentNode.insertBefore(preWrapper, preElement);
            preWrapper.appendChild(preElement);
            preWrapper.appendChild(copyButton);

            copyButton.addEventListener('click', async () => {
                const code = preElement.querySelector('code')?.innerText || preElement.innerText;
                try {
                    await navigator.clipboard.writeText(code);
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    copyButton.className = 'absolute top-3 right-3 bg-green-600 text-white p-2 rounded text-sm';
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                        copyButton.className = 'absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded text-sm transition-all duration-200 opacity-0 group-hover:opacity-100 transform hover:scale-110';
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy code: ', err);
                }
            });
        });
    }

    setupReadTime() {
        const articleContent = document.querySelector('.article-content');
        if (articleContent) {
            const text = articleContent.textContent || articleContent.innerText;
            const wordCount = text.trim().split(/\s+/).length;
            const readTime = Math.ceil(wordCount / 200);
            
            const readTimeElement = document.getElementById('article-read-time');
            if (readTimeElement) {
                readTimeElement.textContent = `${readTime} min read`;
            }
            
            const wordCountElement = document.getElementById('article-word-count');
            if (wordCountElement) {
                wordCountElement.textContent = `${wordCount.toLocaleString()} words`;
            }
        }
    }

    setupTableOfContents() {
        const headings = document.querySelectorAll('.article-content h2, .article-content h3');
        const tocContainer = document.getElementById('table-of-contents');
        
        if (headings.length > 2 && tocContainer) {
            let tocHTML = '<div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">';
            tocHTML += '<h3 class="text-lg font-semibold mb-4 text-blue-900"><i class="fas fa-list-ol mr-2"></i>Table of Contents</h3><ul class="space-y-2">';
            
            headings.forEach((heading, index) => {
                const id = heading.id || `section-${index}`;
                heading.id = id;
                
                const level = heading.tagName.toLowerCase();
                const indent = level === 'h3' ? 'ml-4 text-sm' : 'font-medium';
                const icon = level === 'h2' ? 'fas fa-caret-right' : 'fas fa-minus';
                
                tocHTML += `
                    <li class="${indent}">
                        <a href="#${id}" class="text-blue-700 hover:text-blue-900 transition-colors duration-200 flex items-center group">
                            <i class="${icon} mr-2 text-blue-500 group-hover:translate-x-1 transition-transform"></i>
                            ${heading.textContent}
                        </a>
                    </li>
                `;
            });
            
            tocHTML += '</ul></div>';
            tocContainer.innerHTML = tocHTML;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas ${
                    type === 'success' ? 'fa-check-circle' :
                    type === 'error' ? 'fa-exclamation-circle' :
                    'fa-info-circle'
                } mr-3"></i>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}

// Utility functions
const ArticleUtils = {
    formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    },

    setupSmoothScroll() {
        document.querySelectorAll('.article-content a[href^="#"]').forEach(anchor => {
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
    },

    // Enhanced syntax highlighting
    highlightCodeBlocks() {
        document.querySelectorAll('pre code').forEach((block) => {
            const lang = block.className.match(/language-(\w+)/);
            if (lang) {
                block.setAttribute('data-language', lang[1]);
            }
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.professionalArticle = new ProfessionalArticle();
    ArticleUtils.setupSmoothScroll();
    ArticleUtils.highlightCodeBlocks();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProfessionalArticle, ArticleUtils };
}