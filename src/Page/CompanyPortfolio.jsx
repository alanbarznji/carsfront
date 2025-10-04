import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, ArrowRight, Phone, Mail, MapPin, Users, Building, Globe, TrendingUp, Award, Shield, CheckCircle, Eye, Target, Heart, BarChart3, Briefcase, FileText, Calendar, ExternalLink, ChevronRight, Star, Zap } from 'lucide-react';
import '../assets/pro.css'
const ProfessionalHoldingWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const [counters, setCounters] = useState({ 0: 0, 1: 0, 2: 0, 3: 0 });
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Typewriter effect for hero text
  const words = ['Tomorrow\'s', 'Future', 'Next Generation', 'Revolutionary', 'Innovative'];
  
  useEffect(() => {
    const typeSpeed = 150;
    const deleteSpeed = 100;
    const delayBetweenWords = 2000;
    
    const currentWord = words[currentWordIndex];
    
    if (!isDeleting && typedText === currentWord) {
      setTimeout(() => setIsDeleting(true), delayBetweenWords);
    } else if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    } else {
      const timeout = setTimeout(() => {
        setTypedText(prev => 
          isDeleting 
            ? prev.slice(0, -1)
            : currentWord.slice(0, prev.length + 1)
        );
      }, isDeleting ? deleteSpeed : typeSpeed);
      
      return () => clearTimeout(timeout);
    }
  }, [typedText, isDeleting, currentWordIndex]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Counter animation
  const animateCounter = (index, targetValue, isVisible) => {
    if (!isVisible) {
      setCounters(prev => ({ ...prev, [index]: 0 }));
      return;
    }

    const target = parseInt(targetValue.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let currentValue = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      currentValue += increment;
      
      if (step >= steps) {
        currentValue = target;
        clearInterval(timer);
      }
      
      setCounters(prev => ({ ...prev, [index]: Math.floor(currentValue) }));
    }, duration / steps);
  };

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            setActiveSection(entry.target.id);
            
            if (entry.target.id === 'metrics') {
              metrics.forEach((metric, index) => {
                setTimeout(() => {
                  animateCounter(index, metric.value, true);
                }, index * 300);
              });
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('.section-animate');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const businessUnits = [
    {
      name: "dawana Distribution",
      sector: "Distribution & Logistics",
      description: "Leading distribution network across Iraq and UAE with advanced supply chain management.",
      icon: <Globe className="w-8 h-8" />,
      metrics: "500+ Retail Partners",
      color: "from-blue-600 to-blue-700"
    },
    {
      name: "dawana Investments",
      sector: "Private Equity & Ventures",
      description: "Strategic investments in emerging markets with focus on technology and innovation.",
      icon: <TrendingUp className="w-8 h-8" />,
      metrics: "$50M+ Assets Under Management",
      color: "from-green-600 to-green-700"
    },
    {
      name: "dawana Development",
      sector: "Real Estate & Infrastructure",
      description: "Premium real estate development and infrastructure projects across the region.",
      icon: <Building className="w-8 h-8" />,
      metrics: "2M+ sq ft Developed",
      color: "from-purple-600 to-purple-700"
    },
    {
      name: "dawana Technologies",
      sector: "Digital Solutions",
      description: "Advanced ERP systems, digital transformation, and technology consulting services.",
      icon: <Zap className="w-8 h-8" />,
      metrics: "100+ Enterprise Clients",
      color: "from-orange-600 to-orange-700"
    }
  ];

  const metrics = [
    { value: "1500+", label: "Employees", icon: <Users className="w-6 h-6" /> },
    { value: "14", label: "Brands", icon: <Award className="w-6 h-6" /> },
    { value: "25+", label: "Years Experience", icon: <BarChart3 className="w-6 h-6" /> },
    { value: "2", label: "Countries", icon: <Globe className="w-6 h-6" /> }
  ];

  const coreValues = [
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Vision",
      subtitle: "Leading the Future",
      description: "To be the premier diversified holding company in the region, driving sustainable growth and creating lasting value for all stakeholders."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Mission",
      subtitle: "Excellence in Everything",
      description: "We focus on sustainable growth for our stakeholders and positive community engagement through innovation, integrity, and operational excellence."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Values",
      subtitle: "Principled Leadership",
      description: "Integrity, quality, responsibility, and innovation guide our commitment to responsible and balanced development across all ventures."
    }
  ];

  const testimonials = [
    {
      quote: "dawana Holding has been instrumental in transforming our supply chain operations. Their expertise and reliability are unmatched.",
      author: "Sarah Al-Ahmad",
      position: "CEO, Regional Retail Group",
      company: "Leading FMCG Distributor"
    },
    {
      quote: "The partnership with dawana Technologies revolutionized our digital infrastructure. Their ERP solution increased our efficiency by 40%.",
      author: "Mohammad Hassan",
      position: "Operations Director",
      company: "Manufacturing Conglomerate"
    },
    {
      quote: "Working with dawana Development on our flagship project was exceptional. They delivered beyond expectations with uncompromising quality.",
      author: "Lisa Thompson",
      position: "Project Manager",
      company: "International Architecture Firm"
    }
  ];

  const newsItems = [
    {
      date: "December 15, 2024",
      category: "Investment",
      title: "dawana Holding Announces Strategic Partnership with Tech Innovators",
      excerpt: "New $25M investment fund launched to support emerging technology startups in the region.",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop"
    },
    {
      date: "November 28, 2024",
      category: "Expansion",
      title: "New Distribution Hub Opens in Dubai",
      excerpt: "State-of-the-art 100,000 sq ft facility enhances regional supply chain capabilities.",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=250&fit=crop"
    },
    {
      date: "November 10, 2024",
      category: "Sustainability",
      title: "dawana Holding Commits to Carbon Neutrality by 2030",
      excerpt: "Comprehensive sustainability initiative launched across all business units.",
      image: "https://images.unsplash.com/photo-1497436072909-f5e4be956fde?w=400&h=250&fit=crop"
    }
  ];

 useEffect(()=>{
const resize=()=>{
    useState()
}
 },[])
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden pt-[50px] ">
 
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50 
          ? 'bg-white/98 backdrop-blur-xl shadow-2xl border-b border-gray-200/50' 
          : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-8">
          <div className="flex justify-between items-center py-5">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Building className="w-7 h-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  dawana
                </div>
                <div className="text-xs font-semibold text-gray-500 -mt-1 tracking-wider">
                  HOLDING COMPANY
                </div>
              </div>
            </div>
            
      
         
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className=" p-3 rounded-xl hover:bg-gray-100 transition-all duration-300 border border-gray-200 shadow-sm"
            >
              {isMenuOpen ? 
                <X className="w-6 h-6 text-gray-700" /> : 
                <Menu className="w-6 h-6 text-gray-700" />
              }
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className=" py-8 bg-white/95 backdrop-blur-xl rounded-3xl mx-4 mb-4 shadow-2xl border border-gray-100 animate-in slide-in-from-top">
              <div className="space-y-6 px-6">
                {['home', 'about', 'business-units', 'leadership', 'news', 'contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item}`}
                    className="block py-3 px-4 font-semibold text-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item === 'home' ? 'Home' : 
                     item === 'about' ? 'About Us' :
                     item === 'business-units' ? 'Business Units' :
                     item === 'leadership' ? 'Leadership' :
                     item === 'news' ? 'News' : 'Contact'}
                  </a>
                ))}
                <button className="w-full mt-6 px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg">
                  Investor Relations
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative flex items-center section-animate opacity-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
        
        {/* Sophisticated Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.05) 0%, transparent 50%),
              linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.02) 50%, transparent 70%)
            `
          }}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="max-w-2xl">
              <div className="inline-flex items-center px-4 py-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-full text-sm font-semibold mb-8">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></div>
                Diversified Operating Holding Company
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 text-gray-900 leading-tight">
                <span className="inline-block animate-bounce-gentle">Building</span>
                <span className="block text-purple-600 typewriter-container">
                  <span className="typewriter-text">{typedText}</span>
                  <span className="typewriter-cursor">|</span>
                </span>
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.5s'}}>Enterprises</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed animate-text-reveal">
                <span className="text-reveal-line" style={{animationDelay: '1s'}}>We focus on sustainable growth for our stakeholders and positive community engagement.</span>
                <span className="text-reveal-line" style={{animationDelay: '1.5s'}}>Our commitment to responsible and balanced development is guided by our core values of</span>
                <span className="text-reveal-line" style={{animationDelay: '2s'}}>excellence, integrity, and innovation.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                  Explore Our Portfolio
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 border-2 border-purple-300 text-purple-700 rounded-xl font-semibold hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-300">
                  Investor Presentation
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">25+</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">1500+</div>
                  <div className="text-sm text-gray-600">Employees</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">2</div>
                  <div className="text-sm text-gray-600">Countries</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-3xl transform rotate-3 opacity-15"></div>
              <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop"
                  alt="dawana Holding Corporate"
                  className="w-full h-80 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Specialized in</div>
                      <div className="text-lg font-semibold text-gray-900">Emerging Markets</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Advanced ERP systems, international experience, and ethical reputation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-purple-600" />
          </div>
      </section>

      {/* Metrics Section */}
      <section id="metrics" className="py-20 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 section-animate opacity-0">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className="text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-2xl shadow-xl flex items-center justify-center text-purple-600 group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  {metric.icon}
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
                  {metric.value.includes('+') 
                    ? `${counters[index]}+` 
                    : counters[index]
                  }
                </div>
                <div className="text-gray-600 font-medium">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 section-animate opacity-0">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-4">
                  About dawana Holding
                </div>
                <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                  Leading Through
                  <span className="text-blue-600"> Innovation</span>
                </h2>
                <p className="text-lg text-gray-600 leading-relaxed">
                  dawana Holding is a diversified conglomerate with multiple companies in various industries, 
                  operating as an influential distribution channel across Iraq and the UAE.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  "Advanced ERP system integration across all business units",
                  "Wealth of international experience in emerging markets",
                  "Rich history spanning over 25 years of excellence",
                  "Multi-disciplinary team of industry experts",
                  "Vast network of warehousing facilities"
                ].map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                Learn More About Us
                <ExternalLink className="w-4 h-4 ml-2" />
              </button>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 rounded-2xl opacity-10 transform -rotate-2"></div>
              <img
                src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=700&h=500&fit=crop"
                alt="dawana Holding Team"
                className="relative rounded-2xl shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Business Units Section */}
      <section id="business-units" className="py-24 bg-gray-50 section-animate opacity-0">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
              Our Business Portfolio
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="inline-block animate-word-slide-up">Diversified</span>
              <span className="inline-block animate-word-slide-up" style={{animationDelay: '0.2s'}}> Excellence</span>
              <span className="text-blue-600 inline-block animate-word-slide-up" style={{animationDelay: '0.4s'}}> Across</span>
              <span className="inline-block animate-word-slide-up" style={{animationDelay: '0.6s'}}> Industries</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our portfolio spans multiple sectors, each contributing to sustainable growth and innovation in their respective markets.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {businessUnits.map((unit, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${unit.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {unit.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 mb-1">{unit.sector}</div>
                    <div className="text-sm font-semibold text-blue-600">{unit.metrics}</div>
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                  {unit.name}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-6">
                  {unit.description}
                </p>

                <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                  Learn More
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section id="leadership" className="py-24 section-animate opacity-0">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-4">
              Our Values
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="inline-block animate-bounce-in">Guided</span>
              <span className="inline-block animate-bounce-in" style={{animationDelay: '0.1s'}}> by</span>
              <span className="text-blue-600 inline-block animate-bounce-in" style={{animationDelay: '0.2s'}}> Principled</span>
              <span className="inline-block animate-bounce-in" style={{animationDelay: '0.3s'}}> Leadership</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <div
                key={index}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 group-hover:text-white transition-all duration-500 group-hover:scale-110">
                  {value.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{value.title}</h3>
                <div className="text-blue-600 font-semibold mb-4">{value.subtitle}</div>
                
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-gray-900 text-white section-animate opacity-0">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-white/10 text-blue-300 rounded-full text-sm font-medium mb-4">
              Client Testimonials
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="inline-block animate-glow">Trusted</span>
              <span className="inline-block animate-glow" style={{animationDelay: '0.2s'}}> by</span>
              <span className="text-blue-400 inline-block animate-glow" style={{animationDelay: '0.4s'}}> Industry</span>
              <span className="inline-block animate-glow" style={{animationDelay: '0.6s'}}> Leaders</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-2xl font-light mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                <div className="flex items-center justify-center">
                  <div className="text-center">
                    <div className="font-semibold text-lg">{testimonials[currentTestimonial].author}</div>
                    <div className="text-blue-300">{testimonials[currentTestimonial].position}</div>
                    <div className="text-gray-400 text-sm">{testimonials[currentTestimonial].company}</div>
                  </div>
                </div>
              </div>

              {/* Testimonial Dots */}
              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial 
                        ? 'bg-blue-400 w-8' 
                        : 'bg-gray-600 hover:bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-24 section-animate opacity-0">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-4">
              Latest News
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              <span className="inline-block animate-float">Stay</span>
              <span className="inline-block animate-float" style={{animationDelay: '0.2s'}}> Updated</span>
              <span className="inline-block animate-float" style={{animationDelay: '0.4s'}}> with</span>
              <span className="text-blue-600 inline-block animate-float" style={{animationDelay: '0.6s'}}> Our</span>
              <span className="inline-block animate-float" style={{animationDelay: '0.8s'}}> Journey</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {newsItems.map((item, index) => (
              <article
                key={index}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-blue-200"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {item.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-3">{item.date}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {item.excerpt}
                  </p>
                  <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold">
              View All News
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white section-animate opacity-0">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-3 py-1 bg-white/10 backdrop-blur-sm text-blue-200 rounded-full text-sm font-medium mb-4">
              Get In Touch
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="inline-block animate-text-shine">Partner</span>
              <span className="inline-block animate-text-shine" style={{animationDelay: '0.3s'}}> with</span>
              <span className="text-blue-300 inline-block animate-text-shine" style={{animationDelay: '0.6s'}}> Industry</span>
              <span className="inline-block animate-text-shine" style={{animationDelay: '0.9s'}}> Leaders</span>
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Ready to explore opportunities? Connect with our team to discuss partnerships, 
              investments, and strategic collaborations.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-6">Corporate Headquarters</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Iraq Office</h4>
                      <p className="text-blue-100">Baghdad Business District</p>
                      <p className="text-blue-100">Baghdad, Iraq</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <MapPin className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">UAE Office</h4>
                      <p className="text-blue-100">Dubai International Financial Centre</p>
                      <p className="text-blue-100">Dubai, United Arab Emirates</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Phone className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Phone</h4>
                      <p className="text-blue-100">+964 770 123 4567 (Iraq)</p>
                      <p className="text-blue-100">+971 4 123 4567 (UAE)</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                      <Mail className="w-6 h-6 text-blue-300" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">Email</h4>
                      <p className="text-blue-100">info@dawanaholding.com</p>
                      <p className="text-blue-100">investors@dawanaholding.com</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/20">
                <h4 className="font-semibold text-lg mb-4">Business Hours</h4>
                <div className="space-y-2 text-blue-100">
                  <div className="flex justify-between">
                    <span>Sunday - Thursday</span>
                    <span>8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Friday - Saturday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">Send us a Message</h3>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all duration-300"
                      placeholder="Smith"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="john.smith@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">Company</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all duration-300"
                    placeholder="Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">Inquiry Type</label>
                  <select className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white focus:border-blue-400 focus:outline-none transition-all duration-300">
                    <option value="">Select an option</option>
                    <option value="partnership">Partnership Opportunities</option>
                    <option value="investment">Investment Inquiries</option>
                    <option value="business">Business Development</option>
                    <option value="media">Media & Press</option>
                    <option value="careers">Career Opportunities</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">Message</label>
                  <textarea
                    rows="4"
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 text-white placeholder-blue-200 focus:border-blue-400 focus:outline-none transition-all duration-300 resize-none"
                    placeholder="Tell us about your inquiry..."
                  ></textarea>
                </div>
                
                <button className="w-full px-8 py-4 bg-white text-blue-900 rounded-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-300 shadow-lg font-semibold">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-8 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">dawana</div>
                  <div className="text-xs text-gray-400 -mt-1">HOLDING COMPANY</div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                A diversified operating holding company focused on sustainable growth, 
                community engagement, and creating lasting value across multiple industries 
                in Iraq and the UAE.
              </p>
              <div className="text-sm text-gray-400">
                © 2024 dawana Holding. All rights reserved.
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#about" className="hover:text-blue-400 transition-colors">About Us</a></li>
                <li><a href="#business-units" className="hover:text-blue-400 transition-colors">Business Units</a></li>
                <li><a href="#leadership" className="hover:text-blue-400 transition-colors">Leadership</a></li>
                <li><a href="#news" className="hover:text-blue-400 transition-colors">News & Media</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Services</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Distribution & Logistics</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Investment Management</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Real Estate Development</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Technology Solutions</li>
                <li className="hover:text-blue-400 transition-colors cursor-pointer">Consulting Services</li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Compliance</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Investor Relations</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              Regulated by the Central Bank of Iraq and UAE Central Bank
            </div>
            <div className="flex space-x-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors">ISO 9001:2015 Certified</a>
              <a href="#" className="hover:text-blue-400 transition-colors">ESG Compliant</a>
            </div>
          </div>
        </div>
      </footer>

 
    </div>
  );
};

export default ProfessionalHoldingWebsite;