import Header from "@/components/header";
import Footer from "@/components/footer";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-black mb-8">Privacy Policy</h1>

          <div className="space-y-6 text-gray-700">
            <section className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <p className="text-sm font-semibold text-gray-800">
                <strong>Please note:</strong> The English translation of the Jo
                Limo Privacy Policy is provided for the convenience of our
                non-Arabic-speaking customers. Regardless of this, only the
                original Jordanian-language version is legally binding.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-500 mb-4">
                Last Updated: January 2025
              </p>
            </section>

            {/* Table of Contents */}
            <section className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-black mb-4">
                Table of Contents
              </h2>
              <ol className="list-decimal pl-6 space-y-2 text-sm">
                <li>
                  <a
                    href="#section-1"
                    className="text-blue-600 hover:underline"
                  >
                    Scope
                  </a>
                </li>
                <li>
                  <a
                    href="#section-2"
                    className="text-blue-600 hover:underline"
                  >
                    Name and Contact Information of the Controller
                  </a>
                </li>
                <li>
                  <a
                    href="#section-3"
                    className="text-blue-600 hover:underline"
                  >
                    Data Security
                  </a>
                </li>
                <li>
                  <a
                    href="#section-4"
                    className="text-blue-600 hover:underline"
                  >
                    Provision of the Websites
                  </a>
                </li>
                <li>
                  <a
                    href="#section-5"
                    className="text-blue-600 hover:underline"
                  >
                    Cookies, Pixels and Similar Technologies
                  </a>
                </li>
                <li>
                  <a
                    href="#section-6"
                    className="text-blue-600 hover:underline"
                  >
                    Data Processing During Registered Use of Jo Limo Services
                    and Booking Rides
                  </a>
                </li>
                <li>
                  <a
                    href="#section-7"
                    className="text-blue-600 hover:underline"
                  >
                    Payment & Fraud Prevention
                  </a>
                </li>
                <li>
                  <a
                    href="#section-8"
                    className="text-blue-600 hover:underline"
                  >
                    Communication with Jo Limo
                  </a>
                </li>
                <li>
                  <a
                    href="#section-9"
                    className="text-blue-600 hover:underline"
                  >
                    E-mail Advertising, Newsletter
                  </a>
                </li>
                <li>
                  <a
                    href="#section-10"
                    className="text-blue-600 hover:underline"
                  >
                    Involvement of Data Processors by Jo Limo
                  </a>
                </li>
                <li>
                  <a
                    href="#section-11"
                    className="text-blue-600 hover:underline"
                  >
                    Rights of Data Subjects
                  </a>
                </li>
                <li>
                  <a
                    href="#section-12"
                    className="text-blue-600 hover:underline"
                  >
                    Automated Decisions
                  </a>
                </li>
                <li>
                  <a
                    href="#section-13"
                    className="text-blue-600 hover:underline"
                  >
                    Data Erasure and Storage Duration
                  </a>
                </li>
                <li>
                  <a
                    href="#section-14"
                    className="text-blue-600 hover:underline"
                  >
                    Amendment or Update of this Privacy Policy
                  </a>
                </li>
              </ol>
            </section>

            {/* Section 1 */}
            <section id="section-1">
              <h2 className="text-2xl font-semibold text-black mb-4">
                1. Scope
              </h2>
              <p className="mb-4">
                We, Jo Limo (&quot;Jo Limo&quot;), take the protection of your
                personal data seriously and protect your privacy when processing
                them in accordance with the applicable data protection
                regulations.
              </p>
              <p className="mb-4">
                This privacy policy informs you as a visitor of the Jo Limo
                websites, as a user or customer of the online platform of Jo
                Limo, or other services of Jo Limo (together also &quot;Jo Limo
                Services&quot;) which of your personal data is processed by Jo
                Limo and for which purpose. The Jo Limo Services are not aimed
                at minors.
              </p>
              <p>
                Information on the processing of personal data of chauffeurs can
                be found in the Chauffeur Privacy Policy.
              </p>
            </section>

            {/* Section 2 */}
            <section id="section-2">
              <h2 className="text-2xl font-semibold text-black mb-4">
                2. Name and Contact Information of the Controller
              </h2>
              <p className="mb-4">
                The controller for the processing of data within the meaning of
                the General Data Protection Regulation (GDPR) is:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-4">
                <p className="font-semibold text-black mb-2">
                  Jordan Limousine Services LLC
                </p>
                <p>Airport Road</p>
                <p>11104 Amman, Jordan</p>
                <p className="mt-2">
                  E-Mail:{" "}
                  <a
                    href="mailto:info@jo-limo.com"
                    className="text-blue-600 hover:underline"
                  >
                    info@jo-limo.com
                  </a>
                </p>
              </div>
              <p>
                You can find further information on Jo Limo in the{" "}
                <Link
                  href="/legal-terms"
                  className="text-blue-600 hover:underline"
                >
                  Legal Terms
                </Link>
                .
              </p>
            </section>

            {/* Section 3 */}
            <section id="section-3">
              <h2 className="text-2xl font-semibold text-black mb-4">
                3. Data Security
              </h2>
              <p className="mb-4">
                Jo Limo uses appropriate technical and organizational security
                measures to ensure a level of protection for personal data
                appropriate to the risk, taking into account the state of the
                art, implementation costs and the nature, scope, context and
                purposes of processing as well as the risk of varying likelihood
                and the degree of risk. The transfer of personal data between
                your end device and Jo Limo is generally carried out in an
                encrypted form (TLS encryption). You can identify an encrypted
                connection for example by the lock symbol in the address line of
                your browser.
              </p>
              <p className="mb-4">
                If you communicate with us by e-mail, access by third parties
                cannot be ruled out. Jo Limo also uses transport encryption for
                e-mails in general. But in the case of confidential information,
                Jo Limo recommends using the postal way or fully encrypted
                e-mail communication (PGP). Please let us know if you would like
                to correspond with us by e-mail in an encrypted form so that we
                can give you information on the relevant addresses and public
                keys.
              </p>
            </section>

            {/* Section 4 */}
            <section id="section-4">
              <h2 className="text-2xl font-semibold text-black mb-4">
                4. Provision of the Websites
              </h2>
              <p className="mb-4">
                When visiting Jo Limo websites for information purposes, i.e.
                even without your registration, data is automatically collected
                regarding the usage through your browser (hereinafter &quot;surf
                data&quot;). This includes your IP address, the status code, the
                Jo Limo websites visited, date and time of the server request,
                browser type and browser version, referrer (website visited
                beforehand), files transferred and data volume. The surf data is
                stored by Jo Limo in so-called log files. If you visit Jo Limo
                websites without having a Jo Limo account, we will not know who
                you are.
              </p>
              <p className="mb-4">
                We inform you about the cookies and analysis services used by Jo
                Limo in section 5. Otherwise, your surf data will not be
                provided to third parties. The processing of surf data is mainly
                carried out to establish and maintain the technical connection
                when surfing the internet. This data is also used by Jo Limo in
                a pseudonymized or anonymized form in order to analyze the use
                of our websites, to design and improve the Jo Limo services to
                meet demand, to recognize and eliminate technical or
                process-related disruptions and problems and to prevent illegal
                use of the Jo Limo services (e.g. fraudulent booking,
                cyberattacks).
              </p>
              <p className="mb-4">
                Stored log files are erased or anonymized, provided they are no
                longer required to ensure the general functionality of Jo Limo
                services. Jo Limo retains the log files only insofar as you have
                consented to this or if there are legal retention obligations.
              </p>
              <p>
                The legal basis for the processing of personal data when
                providing websites is Art. 6 Paragraph 1 lit f GDPR (Jo
                Limo&apos;s legitimate interest). Insofar you are a Jo Limo user
                or customer, the legal basis is also Art. 6 para. 1 lit. b GDPR
                (contract performance). If you have consented to an extended
                usage of your surf data, the legal basis is Art. 6 Paragraph 1
                lit. a GDPR (your consent). You can revoke your consent at any
                time.
              </p>
            </section>

            {/* Section 5 */}
            <section id="section-5">
              <h2 className="text-2xl font-semibold text-black mb-4">
                5. Cookies, Pixels and Similar Technologies
              </h2>
              <p className="mb-4">
                When using Jo Limo services, cookies, pixels or similar methods
                may be used. This is common for most large websites.
              </p>
              <p className="mb-4">
                Cookies are small text files and pixels are small graphic files
                which can be stored on the user&apos;s end device.
              </p>
              <p className="mb-4">
                As part of your use of Jo Limo Services, Jo Limo sets the
                cookies that are necessary for Jo Limo to provide a feature you
                request (e.g., language, login status, cookie consent). Jo Limo
                also uses, where you have consented, its own and third party
                cookies to analyze and improve the use of the Jo Limo Services,
                to improve and personalize functionality to you, to detect and
                correct malfunctions and problems of a technical or process
                nature, to prevent unlawful use of the Jo Limo Services (e.g.
                fraudulent booking, cyber-attacks) and for marketing purposes
                (including the measurement, analysis and evaluation of
                advertising).
              </p>
              <p className="mb-4">
                Additionally, you can prevent the storage of cookies and delete
                existing cookies at any time in the settings of your browser.
                However, this may lead to the fact that individual functions of
                the Jo Limo Services are not or only partially available. The
                storage period varies per cookie and can be viewed in your
                browser.
              </p>
              <p>
                The legal basis for the processing of personal data when using
                cookies, pixels and similar procedures are Art. 6 para. 1 lit. a
                (your consent) and lit. f GDPR (legitimate interest of Jo Limo
                in case of necessary cookies).
              </p>
            </section>

            {/* Section 6 */}
            <section id="section-6">
              <h2 className="text-2xl font-semibold text-black mb-4">
                6. Data Processing During Registered Use of Jo Limo Services and
                Booking Rides
              </h2>
              <p className="mb-4">
                Jo Limo processes the following personal data provided by you
                when you register and use Jo Limo Services or when you book
                rides (hereinafter &quot;customer data&quot;).
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>
                  Personal master data (form of address, title, first name, last
                  name, company, address, zip code, place, country);
                </li>
                <li>
                  Contact data (e.g. telephone number, cellphone number, e-mail
                  address);
                </li>
                <li>
                  Contract data (e.g. time and manner of registration, status);
                </li>
                <li>
                  Ride-related data (e.g. pickup location, destination, times,
                  flight number, special requests);
                </li>
                <li>
                  Status (e.g. corporate account), customer history (e.g.
                  previous rides);
                </li>
                <li>
                  Contract invoicing (e.g. invoices, status, invoicing address)
                  and payment data (e.g. last 4 digits of the credit card
                  number).
                </li>
              </ul>
              <p className="mb-4">
                The customer data will be used for Jo Limo services, i.e. for
                the personalized fulfillment of the framework agreement after
                registration (creation, storage, administration and support of
                your Jo Limo account), for the procurement of booked rides and
                for the fulfillment of the contract of carriage for the benefit
                of the customer with the limousine service provider. Jo Limo
                provides customer data to third parties, if necessary, in
                particular to the limousine service providers so that the
                customer can be transported in accordance with their booking and
                the transport can be processed.
              </p>
              <p className="mb-4">
                The payment data collected is stored via a payment service
                provider (HyperPay) and transferred to the intermediary
                financial service provider or bank (see Section 7).
              </p>
              <p className="mb-4">
                Personal data can be transmitted to limousine service providers
                in a third-party country outside of the European Union or the
                European Economic Area in which the transport is intended to
                take place. Jo Limo cannot generally provide further information
                on the data protection level in the third-party country. An
                adequacy decision (see Art. 45 Paragraph 3 GDPR) or suitable
                guarantees (see Art. 46 GDPR) are not required for the
                transmission since the transmission is required for the
                performance of a contract between the data subject and the
                controller or to carry out pre-contractual measures upon request
                from the data subject (Art. 49 Paragraph 1 lit b GDPR) or
                because the transmission is required to enter into or to perform
                a contract concluded in the interest of the data subject by the
                controller with another natural or legal person (Art. 49
                Paragraph 1 lit c GDPR).
              </p>
              <p className="mb-4">
                The legal basis for the processing of personal data during the
                registered use of Jo Limo Services and during the booking of
                trips is Art. 6 para. 1 lit. b GDPR (contract performance). If
                the data subject provides additional, voluntary information
                (e.g. flight number, special requests), the legal basis is their
                consent according to Art. 6 Paragraph 1 lit a GDPR and our
                legitimate interest according to Art. 6 Paragraph 1 lit. f GDPR.
              </p>
              <p>
                In addition, Jo Limo processes customer data in order to analyse
                the use of the Jo Limo Services, to design and improve them in a
                demand-oriented and personalised manner, to advertise the Jo
                Limo Services, to detect, limit and eliminate malfunctions and
                problems of a technical or process-related nature and to prevent
                illegal use of the Jo Limo Services (e.g. fraudulent booking,
                cyberattacks). In this respect, the legal basis for the
                processing of personal data is Art. 6 para. 1 lit. f GDPR
                (legitimate interest of Jo Limo). Data will not be passed on to
                recipients in this respect unless to Jo Limo&apos;s data
                processors (see Art. 28 GDPR) or as far as otherwise permitted
                by law.
              </p>
            </section>

            {/* Section 7 */}
            <section id="section-7">
              <h2 className="text-2xl font-semibold text-black mb-4">
                7. Payment & Fraud Prevention
              </h2>

              <h3 className="text-xl font-semibold text-black mb-3">
                7.1 Payment
              </h3>
              <p className="mb-4">
                All Jo Limo bookings can be paid by credit or debit card (Visa,
                Mastercard). The credit card information is processed securely
                through our certified payment provider HyperPay, whose systems
                meet the applicable security standards, such as the PCI DSS
                standard (Payment Card Industry Data Security Standard).
              </p>
              <p className="mb-4">
                Jo Limo itself does not store complete credit card data, only
                the last 4 digits in abbreviated form for analysis purposes or
                to prevent fraud. The legal basis for this is Art. 6 Paragraph 1
                lit f GDPR (Jo Limo&apos;s legitimate interest).
              </p>
              <p className="mb-4">
                Card payments are provided by the payment service provider
                HyperPay. The privacy policy for the use of the HyperPay service
                can be found at:{" "}
                <a
                  href="https://www.hyperpay.com/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://www.hyperpay.com/privacy-policy
                </a>
              </p>
              <p>
                The legal basis for payment processing is Art. 6(1)(b) GDPR
                (performance of contract).
              </p>

              <h3 className="text-xl font-semibold text-black mb-3 mt-6">
                7.2 Fraud Prevention
              </h3>
              <p className="mb-4">
                To ensure that a payment instrument is used by its rightful
                owner and to prevent fraud, IP addresses, e-mail addresses,
                payment data and card information may be transmitted to external
                fraud prevention service providers. These service providers
                process personal data on behalf of Jo Limo. The legal basis for
                this processing is Art. 6 para. 1 lit. f GDPR (legitimate
                interest of Jo Limo).
              </p>
              <p>
                In the course of the authentication of the cardholder, it may
                also be necessary for individual transactions that Jo Limo
                requires a copy of an additional identification document (e.g.
                identity card, passport, drivers&apos; licence) or a copy of the
                credit card. Jo Limo will ask you to black out any data that is
                not required (e.g. the credit card number except the last four
                digits). In this respect, the legal basis is Art. 6 para. 1 lit.
                b GDPR (fulfilment of contract), your consent (Art. 6 para. 1
                lit. a GDPR) and our legitimate interest (Art. 6 para. 1 lit. f
                GDPR).
              </p>
            </section>

            {/* Section 8 */}
            <section id="section-8">
              <h2 className="text-2xl font-semibold text-black mb-4">
                8. Communication with Jo Limo
              </h2>
              <p className="mb-4">
                If you contact Jo Limo (e.g. by phone, contact form, feedback
                form, e-mail), the data you provide will be processed to handle
                your request and to answer your inquiry. The legal basis is Art.
                6 Para. 1 lit. a GDPR (consent) and Art. 6 Para. 1 lit. b GDPR
                (fulfilment of contract and initiation of contract).
              </p>
              <p className="mb-4">
                Contact data is also used by Jo Limo - pseudonymised or
                anonymised if possible - to design and improve Jo Limo services
                according to your needs, to identify and eliminate malfunctions
                and problems of a technical or process-related nature and to
                prevent illegal use of Jo Limo services (e.g. fraudulent
                booking, cyberattacks). In this respect, the legal basis for the
                processing of personal data is Art. 6 para. 1 letter f GDPR
                (legitimate interest of Jo Limo).
              </p>
              <p>
                Jo Limo uses external services and tools, e.g. email services,
                to communicate with the customer. The legal basis for the
                processing of personal data is Art. 6 para. 1 lit. f GDPR
                (legitimate interest of Jo Limo). Agreements on commissioned
                data processing exist with the respective providers - where
                necessary.
              </p>
            </section>

            {/* Section 9 */}
            <section id="section-9">
              <h2 className="text-2xl font-semibold text-black mb-4">
                9. E-mail Advertising, Newsletter
              </h2>
              <p className="mb-4">
                If you have agreed to receiving advertising or if Jo Limo
                otherwise has the right, we will use your customer data to send
                you personalized advertising or general newsletters. The
                following data is mainly affected: Form of address, name, e-mail
                address. The purpose of the data processing is for Jo Limo to
                inform you regarding current offers and to draw attention to
                features of Jo Limo services.
              </p>
              <p className="mb-4">
                E-mail advertising and newsletters may contain pixels. In this
                case, a graphic file is inserted into the e-mail sent in HTML
                format, based on which a statistical evaluation may be carried
                out. By using pixels, Jo Limo can detect whether and when
                e-mails have been opened and links contained therein clicked.
                The legal base for the data processing is, insofar as you have
                separately and expressly consented, Art. 6 Paragraph 1 lit a
                GDPR (consent) and otherwise Art. 6 Paragraph 1 lit f GDPR (Jo
                Limo&apos;s legitimate interest).
              </p>
              <p>
                If you do not wish to receive advertising from Jo Limo, you may
                at any time revoke the corresponding use of your e-mail address
                without incurring any costs other than the transmission costs in
                accordance with the base tariffs. To this end, you can use the
                unsubscribe link contained in any mail or you can write an
                e-mail to us using the above-mentioned e-mail address (see
                section 2).
              </p>
            </section>

            {/* Section 10 */}
            <section id="section-10">
              <h2 className="text-2xl font-semibold text-black mb-4">
                10. Involvement of Data Processors by Jo Limo
              </h2>
              <p className="mb-4">
                As far as Jo Limo involves third parties in its data processing,
                e.g. technical service providers such as HyperPay for payment
                processing, PostgreSQL database systems for data management,
                Google Maps for location services, or SendGrid for email
                communications, this is always done on behalf of Jo Limo and
                only if these processors offer sufficient guarantees that
                suitable technical and organisational measures are carried out
                in such a way that the processing is in accordance with the data
                protection requirements, in particular Art. 28 GDPR, and
                guarantees the protection of the rights of the data subject.
              </p>
              <p>
                If processors are located in third countries, the data
                protection requirements for the transfer pursuant to Art. 44 et
                seq. GDPR are complied with in each case. As a rule, the
                appropriate guarantees in third countries are established by
                means of an adequacy decision (Art. 45 para. 3 GDPR) or the
                agreement of standard contractual clauses (see Art. 46 para. 2
                c) GDPR in conjunction with Art. 93 para. 2 GDPR).
              </p>
            </section>

            {/* Section 11 */}
            <section id="section-11">
              <h2 className="text-2xl font-semibold text-black mb-4">
                11. Rights of Data Subjects
              </h2>
              <p className="mb-4">
                If your personal data is processed by Jo Limo, you are the data
                subject (Art. 4 No. 1 GDPR). As the data subject, you have the
                following rights in relation to the personal data affecting you:
              </p>

              <h3 className="text-lg font-semibold text-black mb-2">
                11.1 Right to Information (Art. 15 GDPR)
              </h3>
              <p className="mb-4">
                The data subject has the right to obtain a confirmation from the
                controller as to whether personal data is processed; if this is
                the case, they have a right of information about this personal
                data and further information on the data processing.
              </p>

              <h3 className="text-lg font-semibold text-black mb-2">
                11.2 Right to Rectification (Art. 16 GDPR)
              </h3>
              <p className="mb-4">
                The data subject has the right to obtain from the controller
                without undue delay the rectification or completion of
                inaccurate personal data.
              </p>

              <h3 className="text-lg font-semibold text-black mb-2">
                11.3 Right to Erasure (Art. 17 GDPR)
              </h3>
              <p className="mb-4">
                The data subject has the right to demand from the controller the
                erasure of personal data without undue delay and the controller
                is obliged to erase personal data without undue delay, provided
                the data is no longer required, the data subject revokes their
                consent or lodges an objection to the processing, the personal
                data was processed unlawfully or there is otherwise a ground for
                erasure within the meaning of Art. 17 GDPR and the controller
                does not have the right to object to erasure.
              </p>

              <h3 className="text-lg font-semibold text-black mb-2">
                11.4 Right to the Restriction of Data Processing (Art. 18 GDPR)
              </h3>
              <p className="mb-4">
                The data subject has the right to demand from the controller the
                restriction of processing when one of the conditions mentioned
                in Art. 18 GDPR applies, namely the accuracy of the personal
                data is contested by the data subject or the processing is
                unlawful and the data subject opposes the erasure of the
                personal data.
              </p>

              <h3 className="text-lg font-semibold text-black mb-2">
                11.5 Right to Objection (Art. 21 GDPR)
              </h3>
              <p className="mb-4">
                Insofar as the data processing is based on a legitimate interest
                from our side (Art. 6 Paragraph 1 lit. f GDPR) or is direct
                advertising, the data subject has at any time the right to lodge
                an objection to the processing of personal data affecting them
                for the reasons mentioned in Art. 21 GDPR. The controller will
                then no longer process the personal data, unless they can
                demonstrate compelling legitimate grounds for the processing
                which override the interests, rights and freedoms of the data
                subject or the processing serves for the establishment, exercise
                or defense of legal claims.
              </p>

              <h3 className="text-lg font-semibold text-black mb-2">
                11.6 Right to Data Portability (Art. 20 GDPR)
              </h3>
              <p className="mb-4">
                The data subject has the right within the meaning of Art. 20
                GDPR to receive the personal data, which they have provided to a
                controller, in a structured, commonly used and machine-readable
                format and have the right to transmit this data to another
                controller without hindrance from the controller to which the
                personal data has been provided.
              </p>

              <h3 className="text-lg font-semibold text-black mb-2">
                11.7 Right to Lodge a Complaint (Art. 77 GDPR)
              </h3>
              <p className="mb-4">
                Without prejudice to any other administrative or judicial
                remedy, every data subject has the right to lodge a complaint
                with a supervisory authority according to Art. 77 GDPR.
              </p>

              <h3 className="text-lg font-semibold text-black mb-2">
                11.8 Revocation of Consent (Art. 7 para. 4 GDPR)
              </h3>
              <p>
                If the data processing is based on the consent of a data
                subject, the data subject has the right to revoke his or her
                consent at any time. You can do this by sending an e-mail to:{" "}
                <a
                  href="mailto:info@jo-limo.com"
                  className="text-blue-600 hover:underline"
                >
                  info@jo-limo.com
                </a>
                . The revocation of consent shall not affect the lawfulness of
                the processing carried out on the basis of the consent until the
                revocation.
              </p>
            </section>

            {/* Section 12 */}
            <section id="section-12">
              <h2 className="text-2xl font-semibold text-black mb-4">
                12. Automated Decisions
              </h2>
              <p>
                In the case of Jo Limo, you are only subject to an automated
                decision process (see Art. 22 GDPR) in exceptional cases if you
                re-enter a payment method via which a payment has already
                previously failed or when current indications justify the
                suspicion that it is a fraudulent booking. In these cases, your
                request to book a ride with Jo Limo will be refused. Such an
                automatic decision is required to conclude the contract (Art. 22
                Paragraph 2 lit a GDPR). The data subject has the option of
                contacting us using the mentioned contact data (see section 2)
                in order to have an explanation or an intervention by a person
                or to express their point of view.
              </p>
            </section>

            {/* Section 13 */}
            <section id="section-13">
              <h2 className="text-2xl font-semibold text-black mb-4">
                13. Data Erasure and Storage Duration
              </h2>
              <p>
                We will erase your personal data as soon as the legal basis for
                its processing lapses. However, legal bases may also exist in
                parallel or a new one may intervene with the lapsing of a legal
                basis, such as for example the duty to store determined data to
                fulfill a legal retention obligation (e.g. according to
                commercial or tax law).
              </p>
            </section>

            {/* Section 14 */}
            <section id="section-14">
              <h2 className="text-2xl font-semibold text-black mb-4">
                14. Amendment or Update of this Privacy Policy
              </h2>
              <p>
                Jo Limo reserves the right to update or amend this privacy
                policy at any time without giving reasons, as far as this should
                become necessary, e.g. due to developments in legislation,
                jurisdiction or regulatory actions or due to further technical
                developments. We will notify you of any material changes by
                posting the new Privacy Policy on this page and updating the
                &quot;Last Updated&quot; date.
              </p>
            </section>

            {/* Contact Section */}
            <section className="mt-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-black mb-3">
                  Contact Information
                </h3>
                <p className="font-semibold text-black mb-2">
                  Jordan Limousine Services LLC
                </p>
                <p>Company Number: 200155494</p>
                <p className="mt-2">Shareef Jamil Bin Nasser Street</p>
                <p>King Abdullah Gardens</p>
                <p>PO Box 961003</p>
                <p>Amman 11196, Jordan</p>
                <p className="mt-3">
                  E-mail:{" "}
                  <a
                    href="mailto:info@jo-limo.com"
                    className="text-blue-600 hover:underline"
                  >
                    info@jo-limo.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
