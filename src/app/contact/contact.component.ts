import { Component } from '@angular/core';
import {FormsModule, NgForm} from "@angular/forms";
import {NgIf} from "@angular/common";
import {} from "@angular/common/http";

// @ts-ignore
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  providers: []
})
export class ContactComponent {
  constructor() {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const formData = {
        name: form.value.name,
        email: form.value.email,
        message: form.value.message
      };

      // Sending email via EmailJS (example)
     /* this.sendEmail(formData).subscribe(
        response => {
          console.log('Email sent successfully', response);
          form.reset();
        },
        error => {
          console.error('Error sending email', error);
        }
      );*/
    }
  }

  /*sendEmail(formData: any) {
    // This is a dummy function - you should replace it with actual email sending logic
    const emailServiceUrl = 'https://your-email-service-endpoint';
    return this.http.post(emailServiceUrl, formData);
  }*/

}
