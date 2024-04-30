import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { showHideVertical } from '../animations/show-hide-vertical';

@Component({
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './faqs.component.html',
  styleUrls: [ './faqs.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [ showHideVertical('200') ]
})
export class FaqsComponent {

  private cdr = inject(ChangeDetectorRef);

  individualFaqs = [
    {
      question: "How do I protect my confidentiality?"  ,
      answer: "Your name and contact information are only provided to an Employer if you ACCEPT their connection request ensuring you are in complete control of who sees your information."
    },
    {
      question: "How much does it cost to join CertifyndABA?",
      answer: "It’s free to Individuals."
    },
    {
      question: "What if my current employer sends me a connection request?",
      answer: "Reject it unless you want to interview with your current employer"
    },
    {
      question: "How do I ensure I’m getting relevant connection requests?",
      answer: "Create an accurate and complete profile.  This will lead to very relevant connection requests."
    },
    {
      question: "What else can I do to help make things run smooth?",
      answer: "Be responsive to your notification requests. When you commit to an interview, show up on time and prepared. If it’s something you’re not interested in, reject the request.  This will save both you and the employer valuable time."
    },
    {
      question: "How do I refer other ABA colleagues to this community?",
      answer: "Send them the URL directly or share it on social media. We are working on a referral program to reward you for your referrals in the future."
    },
    {
      question: "How can we make your user experience better?",
      answer: "Send us an email at info@certifynd.com with any questions or comments."
    }
  ];

  employerFaqs = [
    {
      question: "How much does it cost to join CertifyndABA?",
      answer: "When you sign up you can choose which package you’d like."
    },
    {
      question: "Do I owe any additional fees if we hire someone through CertifyndABA?",
      answer: "No"
    },
    {
      question: "What’s the typical Acceptance of connection request rate?",
      answer: "30% - meaning at least 3 out of 10 people will agree to share their information with the intent to interview with your organization"
    },
    {
      question: "How do I avoid being ghosted by individuals?",
      answer: "When you commit to an interview, show up on time and prepared. If you’re interested in the individual, set up the next step and keep the process moving forward and be decisive. If you’re not interested, be direct but kind so they and you can move on."
    },
    {
      question: "What if there is no response to my notification request?",
      answer: "Ensure you have completed all the material in your employer profile and focus on the positives of your organization by listing all the benefits (compensation, health, dental, PTO).  Focus on why your best employees work there today and ensure it comes through in your employer profile.  Double check your digital reviews (Glassdoor, Google, etc.) to ensure you know what people are saying about your organization."
    },
    {
      question: "I’m a hiring authority for my employer but I also want to be aware of opportunities – how do I do this?",
      answer: " Sign up by logging in as an Individual (free)."
    },
    {
      question: "How can we make your user experience better?",
      answer: "Send us an email at info@certifynd.com with any questions or comments."
    }
  ];

  employerFaqStates: any = {};
  individualFaqStates: any = {};

  toggleFaq(type: string, index: number): void {
    if (type === 'employer') {
      this.employerFaqStates[index] = !this.employerFaqStates[index];
    } else {
      this.individualFaqStates[index] = !this.individualFaqStates[index];
    }
  }
}
