export const metadata = {
  title: 'Terms of Service - FileShare Hub',
  description: 'Terms of Service for FileShare Hub file sharing platform.',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8 sm:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Terms of Service
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Last updated: May 31, 2025
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  1. Acceptance of Terms
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  By accessing and using FileShare Hub ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  2. Description of Service
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  FileShare Hub is a file sharing platform that allows users to upload, store, and share files using IPFS (InterPlanetary File System) technology. Our service provides:
                </p>
                <ul className="list-disc pl-6 mt-4 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Secure file upload and storage on IPFS</li>
                  <li>Shareable download links with optional security features</li>
                  <li>File management dashboard</li>
                  <li>Download tracking and analytics</li>
                  <li>Customizable expiration dates and download limits</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  3. User Accounts and Responsibilities
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Safeguarding your password and all activities under your account</li>
                  <li>Ensuring your uploaded content complies with applicable laws</li>
                  <li>Respecting intellectual property rights of others</li>
                  <li>Not uploading malicious software or harmful content</li>
                  <li>Not attempting to gain unauthorized access to our systems</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  4. Acceptable Use Policy
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  You agree not to use the Service to upload, store, or share:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Content that is illegal, harmful, threatening, or abusive</li>
                  <li>Copyrighted material without proper authorization</li>
                  <li>Malware, viruses, or other malicious code</li>
                  <li>Content that violates privacy rights of individuals</li>
                  <li>Spam or unsolicited promotional material</li>
                  <li>Content that promotes hate speech or discrimination</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  5. File Storage and Retention
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Files uploaded to our service are stored on IPFS, a decentralized storage network. While IPFS provides redundancy and permanence, we cannot guarantee indefinite storage of your files. We recommend keeping local backups of important files. Files may be removed from our service if they violate these terms or applicable laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  6. Privacy and Data Protection
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices regarding the collection and use of your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  7. Service Limitations
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                  Our service has the following limitations:
                </p>
                <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                  <li>Maximum file size: 100MB per file</li>
                  <li>Storage quotas may apply based on your account type</li>
                  <li>Bandwidth limitations may apply during peak usage</li>
                  <li>We reserve the right to modify these limitations with notice</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  8. Intellectual Property
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  You retain ownership of any intellectual property rights in the content you upload. By using our service, you grant us a limited, non-exclusive license to store, process, and transmit your content solely for the purpose of providing the service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  9. Termination
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We may terminate or suspend your account and access to the service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  10. Disclaimer of Warranties
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  The service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  11. Limitation of Liability
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  In no event shall FileShare Hub be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or other intangible losses.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  12. Changes to Terms
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Your continued use of the service after such modifications constitutes acceptance of the updated terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  13. Contact Information
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">
                    Email: legal@filesharehub.com<br />
                    Address: FileShare Hub Legal Department<br />
                    [Your Business Address]
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
