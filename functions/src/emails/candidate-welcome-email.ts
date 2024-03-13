import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
export const candidateWelcomeEmail = onDocumentCreated(`users/{userID}`, event => {

  logger.log('event', event);

  const data = event?.data?.data();

  logger.log('event.data.data()', data);

  const firstName = data?.firstName ?? '';
  const lastName = data?.lastName ?? '';
  const displayName = data?.lastName ?? '';
  const email = data?.email ?? '';

  const name = `${firstName}${lastName}`?.length ? `${firstName} ${displayName}` : displayName;

  db.collection('mail').add({
      to: [
        {
          email,
          name
        }
      ],
      subject: `Welcome to CertifyndABA!`,
      html: `<p>Dear ${firstName},</p> <p><strong>Welcome to CertifyndABA</strong>, a pioneering platform dedicated exclusively to ABA professionals like you! As we embark on this exciting journey, we're thrilled to have you with us. We're just warming up, and there's so much more to come!</p> <p><strong>Here's a sneak peek into our immediate plans:</strong></p> <p>Currently, our focus is on building a vibrant community by welcoming talented individuals like you. Soon, we'll be introducing employers into the mix, creating a dynamic ABA professional network.</p> <p><strong>As a member of CertifyndABA, you can look forward to:</strong></p> <ul style="list-style-type: disc;"> <li> <p><strong>Absolute Confidentiality:</strong> Your privacy is paramount. We guarantee that your information will be shared with prospective employers strictly on your terms &ndash; no exceptions.</p> </li> <li> <p><strong>Platform Evolution:</strong> We are committed to continuously enhancing the platform's functionality, ensuring an exceptional user experience for you.</p> </li> <li> <p><strong>Community Engagement:</strong> Stay tuned for insightful content and engaging forums tailored for our ABA community.</p> </li> </ul> <p><strong>We Need Your Insightful Contribution:</strong></p> <ul style="list-style-type: disc;"> <li> <p><strong>Profile Perfection:</strong> Take your time to complete and regularly update your profile. Accuracy and relevance are key to making meaningful connections.</p> </li> <li> <p><strong>Be Proactive:</strong> As we introduce employers in Q1/Q2 of 2024, your prompt responses to their inquiries will help create productive engagements.</p> </li> <li> <p><strong>Your Voice Matters:</strong> Share your valuable feedback with us at <a target="_new" href="mailto:info@certifyndaba.com">info@certifyndaba.com</a>. Your insights are crucial in shaping our platform.</p> </li> <li> <p><strong>Stay Connected:</strong></p> <ul style="list-style-type: disc;"> <li>Like us on <a target="_new" href="https://www.facebook.com/certifyndaba">Facebook</a></li> <li>Follow us on <a target="_new" href="https://www.linkedin.com/company/certifyndaba">LinkedIn</a></li> </ul> </li> <li> <p><strong>Spread the Word:</strong> Help us grow our community. If you have friends or colleagues in ABA, let them know about CertifyndABA. The larger our community, the better we can cater to your professional needs.</p> </li> </ul> <p>We are incredibly grateful to have you as part of the CertifyndABA family. Together, we're not just building a platform; we're shaping the future of ABA professional networking.</p> <p></p> <p>Respectfully,</p> <p>John &amp; Tim<br><a target="_new" href="https://certifyndaba.com">CertifyndABA</a></p>`,
      text: `Dear ${name},\n\nWelcome to CertifyndABA, a pioneering platform dedicated exclusively to ABA professionals like you! As we embark on this exciting journey, we're thrilled to have you with us. We're just warming up, and there's so much more to come!\n\nHere's a sneak peek into our immediate plans:\n\nCurrently, our focus is on building a vibrant community by welcoming talented individuals like you. Soon, we'll be introducing employers into the mix, creating a dynamic ABA professional network.\n\nAs a member of CertifyndABA, you can look forward to:\n\nAbsolute Confidentiality: Your privacy is paramount. We guarantee that your information will be shared with prospective employers strictly on your terms – no exceptions.\n\nPlatform Evolution: We are committed to continuously enhancing the platform's functionality, ensuring an exceptional user experience for you.\n\nCommunity Engagement: Stay tuned for insightful content and engaging forums tailored for our ABA community.\n\nWe Need Your Insightful Contribution:\n\nProfile Perfection: Take your time to complete and regularly update your profile. Accuracy and relevance are key to making meaningful connections.\n\nBe Proactive: As we introduce employers in Q1/Q2 of 2024, your prompt responses to their inquiries will help create productive engagements.\n\nYour Voice Matters: Share your valuable feedback with us at info@certifyndaba.com. Your insights are crucial in shaping our platform.\n\nStay Connected:\n\nLike us on Facebook - https://www.facebook.com/certifyndaba\nFollow us on LinkedIn - https://www.linkedin.com/company/certifyndaba\n\nSpread the Word: Help us grow our community. If you have friends or colleagues in ABA, let them know about CertifyndABA. The larger our community, the better we can cater to your professional needs.\n\nWe are incredibly grateful to have you as part of the CertifyndABA family. Together, we're not just building a platform; we're shaping the future of ABA professional networking.\n\n\nRespectfully,\n\nJohn & Tim\nCertifyndABA - https://certifyndaba.com`
  });
});
