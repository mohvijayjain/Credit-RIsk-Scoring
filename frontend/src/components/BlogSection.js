import React from 'react';
import { ArrowRight } from 'lucide-react';
import './BlogSection.css';

const articlesData = [
  {
    category: "CREDIT TIPS",
    description:
      "Your credit score isn't just a number — it's your financial reputation. Learn the 5 key factors that determine your score.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=60",
    publishDate: "Jan 15, 2026",
    readMoreLink: "#",
    title: "Understanding Credit Scores: The Complete Guide",
  },
  {
    category: "LOAN BASICS",
    description:
      "Before you apply for any loan, make sure you understand these essential terms — from APR to prepayment penalties.",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop&q=60",
    publishDate: "Jan 8, 2026",
    readMoreLink: "#",
    title: "Loan Terminology Every Borrower Should Know",
  },
  {
    category: "DEBT MANAGEMENT",
    description:
      "Struggling with multiple loans? Discover proven strategies to pay off debt faster without sacrificing your lifestyle.",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&auto=format&fit=crop&q=60",
    publishDate: "Dec 22, 2025",
    readMoreLink: "#",
    title: "Smart Strategies for Paying Off Debt Faster",
  },
];

export default function BlogSection() {
  return (
    <section className="blog-section">
      <div className="blog-container">
        <div className="blog-header">
          <span className="blog-caption">KNOWLEDGE HUB</span>
          <h2 className="blog-title">Latest from Our Blog</h2>
        </div>
        
        <div className="blog-grid">
          {articlesData.map((article, index) => (
            <article className="blog-card" key={index}>
              <div className="blog-card-inner">
                <div className="blog-image-wrapper">
                  <img
                    alt={article.title}
                    className="blog-image"
                    src={article.image}
                    loading="lazy"
                  />
                  <span className="blog-category">
                    #{article.category}
                  </span>
                </div>
                
                <div className="blog-content">
                  <h3 className="blog-article-title">
                    {article.title}
                  </h3>
                  <p className="blog-description">
                    {article.description}
                  </p>
                  
                  <div className="blog-footer">
                    <a className="blog-read-more" href={article.readMoreLink}>
                      <span className="read-more-icon">
                        <ArrowRight className="arrow-icon arrow-visible" />
                        <ArrowRight className="arrow-icon arrow-hidden" />
                      </span>
                      Read more
                    </a>
                    <span className="blog-date">
                      {article.publishDate}
                      <span className="date-line" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
