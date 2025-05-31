export const metadata = {
  title: 'Privacy Policy - FileShare Hub',
  description: 'Privacy Policy for FileShare Hub file sharing platform.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Last updated: May 31, 2025
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Introduction
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  FileShare Hub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our file sharing service. Please read this privacy policy carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Information We Collect
                </h2>
                
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  Personal Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We may collect the following personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                  <li>Name and email address (when you create an account)</li>
                  <li>Profile information from third-party authentication providers (GitHub, Google)</li>
                  <li>Payment information (if applicable for premium features)</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  File Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  When you upload files, we collect:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                  <li>File names, sizes, and types</li>
                  <li>Upload timestamps and metadata</li>
                  <li>Download statistics and access logs</li>
                  <li>Sharing preferences and expiration settings</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  Technical Information
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We automatically collect:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>IP addresses and browser information</li>
                  <li>Device type and operating system</li>
                  <li>Usage patterns and navigation data</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. How We Use Your Information
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We use the collected information for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Providing and maintaining our file sharing service</li>
                  <li>Authenticating users and managing accounts</li>
                  <li>Processing file uploads and managing downloads</li>
                  <li>Generating sharing links and managing access controls</li>
                  <li>Sending important service notifications</li>
                  <li>Analyzing usage patterns to improve our service</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Information Sharing and Disclosure
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>With your consent:</strong> When you explicitly agree to share information</li>
                  <li><strong>Service providers:</strong> With trusted third parties who assist in operating our service (IPFS storage, authentication providers)</li>
                  <li><strong>Legal requirements:</strong> When required by law or to protect our rights and safety</li>
                  <li><strong>Business transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. Data Storage and Security
                </h2>
                
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  IPFS Storage
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Your files are stored on IPFS (InterPlanetary File System), a decentralized storage network. This means:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-6">
                  <li>Files are distributed across multiple nodes for redundancy</li>
                  <li>Files are content-addressed and cryptographically hashed</li>
                  <li>We cannot guarantee complete control over file persistence</li>
                  <li>Files may be cached by other IPFS nodes</li>
                </ul>

                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">
                  Security Measures
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We implement appropriate security measures including:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Secure authentication and session management</li>
                  <li>Regular security audits and monitoring</li>
                  <li>Access controls and authorization checks</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Cookies and Tracking Technologies
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Maintain user sessions and authentication</li>
                  <li>Remember user preferences and settings</li>
                  <li>Analyze website usage and performance</li>
                  <li>Provide personalized experiences</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                  You can control cookie settings through your browser preferences, but disabling cookies may affect service functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Your Rights and Choices
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li><strong>Access:</strong> Request information about data we have collected about you</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal information and uploaded files</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a machine-readable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Data Retention
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We retain your personal information and files for as long as necessary to provide our services or as required by law. You may delete your files at any time through your account dashboard. Account information is retained until you request account deletion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. International Data Transfers
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our service may transfer and process your information in countries other than your residence. We ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  10. Children's Privacy
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  11. Changes to This Policy
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date. We encourage you to review this policy periodically.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  12. Contact Us
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    Email: privacy@filesharehub.com<br />
                    Address: FileShare Hub Privacy Team<br />
                    [Your Business Address]<br />
                    <br />
                    Data Protection Officer: dpo@filesharehub.com
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
