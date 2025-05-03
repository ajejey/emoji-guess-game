import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <SEO 
        title="Terms of Service | Guess the Emoji: Multiplayer Party Game"
        description="Our Terms of Service outline the rules and guidelines for using Guess the Emoji: Multiplayer Party Game."
        keywords="terms of service, user agreement, game rules, legal terms, emoji game terms"
        canonicalUrl="/terms-of-service"
      />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-4">Last Updated: May 3, 2025</p>
        
        <div className="prose prose-indigo max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Guess the Emoji ("we," "our," or "us"). By accessing or using our website and multiplayer game (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of the terms, you may not access the Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Communications</h2>
          <p>
            By creating an account or using our Service, you agree to receive communications from us, which may include game updates, notifications, and occasional promotional materials. You can opt out of promotional communications, but you may still receive administrative messages related to the Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. Content</h2>
          <p>
            Our Service allows you to participate in multiplayer games where you can post, link, store, share and otherwise make available certain information, text, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
          </p>
          <p>
            By posting Content on or through the Service, you represent and warrant that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The Content is yours (you own it) or you have the right to use it and grant us the rights and license as provided in these Terms.</li>
            <li>The posting of your Content on or through the Service does not violate the privacy rights, publicity rights, copyrights, contract rights or any other rights of any person.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Prohibited Uses</h2>
          <p>
            You may use our Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
            <li>In any way that infringes upon the rights of others, or in any way is illegal, threatening, fraudulent, or harmful.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service, or which, as determined by us, may harm or offend the Company or users of the Service or expose them to liability.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Intellectual Property</h2>
          <p>
            The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of Guess the Emoji and its licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Guess the Emoji.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Termination</h2>
          <p>
            We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p>
            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
          <p>
            In no event shall Guess the Emoji, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your access to or use of or inability to access or use the Service;</li>
            <li>Any conduct or content of any third party on the Service;</li>
            <li>Any content obtained from the Service; and</li>
            <li>Unauthorized access, use or alteration of your transmissions or content.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Disclaimer</h2>
          <p>
            Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance.
          </p>
          <p>
            Guess the Emoji, its subsidiaries, affiliates, and its licensors do not warrant that:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>The Service will function uninterrupted, secure or available at any particular time or location;</li>
            <li>Any errors or defects will be corrected;</li>
            <li>The Service is free of viruses or other harmful components; or</li>
            <li>The results of using the Service will meet your requirements.</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to These Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>By email: terms@emoji-guess-game.com</li>
            <li>By visiting the <Link to="/contact" className="text-indigo-600 hover:text-indigo-800">Contact</Link> page on our website</li>
          </ul>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-200">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">
            &larr; Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;
