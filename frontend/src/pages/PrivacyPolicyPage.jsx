import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <SEO 
        title="Privacy Policy | Guess the Emoji: Multiplayer Party Game"
        description="Our privacy policy explains how we collect, use, and protect your information when you play Guess the Emoji: Multiplayer Party Game."
        keywords="privacy policy, data protection, emoji game privacy, user data, cookie policy"
        canonicalUrl="/privacy-policy"
      />
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">Last Updated: May 3, 2025</p>
        
        <div className="prose prose-indigo max-w-none">
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Introduction</h2>
          <p>
            Welcome to Guess the Emoji ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our website. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or play our game.
          </p>
          <p>
            Please read this Privacy Policy carefully. By accessing or using our game, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy. If you do not agree with our policies, please do not access or use our game.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Information We Collect</h2>
          
          <h3 className="text-lg font-medium mt-6 mb-3">2.1 Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to us when you use our game, such as:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Display names or usernames you choose when playing the game</li>
            <li>Information you provide in game chats</li>
            <li>Email address (if you contact us directly)</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6 mb-3">2.2 Automatically Collected Information</h3>
          <p>
            When you access our game, we may automatically collect certain information about your device and usage, including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Device information (such as your IP address, browser type, and operating system)</li>
            <li>Game usage data (such as game sessions, gameplay duration, and interaction with features)</li>
            <li>Log data (such as access times, pages viewed, and the page you visited before navigating to our game)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. How We Use Your Information</h2>
          <p>
            We may use the information we collect for various purposes, including to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide, maintain, and improve our game</li>
            <li>Create and manage user accounts</li>
            <li>Process and fulfill game requests</li>
            <li>Send administrative information, such as updates, security alerts, and support messages</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our game</li>
            <li>Detect, prevent, and address technical issues</li>
            <li>Protect against harmful, unauthorized, or illegal activity</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Cookies and Similar Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our game and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier.
          </p>
          <p>
            You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our game.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Third-Party Services</h2>
          <p>
            Our game may contain links to third-party websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p>
            We may use third-party services such as Google Analytics to help us understand how our users use the game. These services may collect information sent by your browser as part of a web page request, such as cookies or your IP address.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Advertising</h2>
          <p>
            We may use third-party Service Providers to show advertisements to you to help support and maintain our game.
          </p>
          <p>
            We use Google AdSense Advertising on our website. Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">7. Children's Privacy</h2>
          <p>
            Our game is not intended for children under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take necessary actions.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">8. Data Security</h2>
          <p>
            We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">9. Changes to This Privacy Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date at the top of this Privacy Policy.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">10. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>By email: privacy@emoji-guess-game.com</li>
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

export default PrivacyPolicyPage;
