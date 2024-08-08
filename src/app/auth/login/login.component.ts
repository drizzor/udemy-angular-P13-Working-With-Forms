import { NgIf } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form');
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const savedForm = window.localStorage.getItem('save-login-form');

      // Remplir le formulaire avec les données sauvegardées
      if(savedForm) {
        const loadedFormData = JSON.parse(savedForm);
        const savedEmail = loadedFormData.email; 
        setTimeout(() => { // setTimeout is used to avoid ExpressionChangedAfterItHasBeenCheckedError in console
          this.form().setValue({email: savedEmail, password: ''});
        }, 1);
      }

      // deounceTime is used to reduce the number of times the valueChanges event is triggered and save the form data to local storage only after 500ms of inactivity
      const subscription = this.form().valueChanges?.pipe(debounceTime(500)).subscribe({
        next: (value) => window.localStorage.setItem(
          'save-login-form', 
          JSON.stringify({email: value.email})
        ),
      });
        this.destroyRef.onDestroy(() => subscription?.unsubscribe()); 
    });
  }

  onSubmit(formData : NgForm) {
    if(formData.form.invalid) return;

    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;

    console.log(formData);
    console.log(enteredEmail, enteredPassword);

    formData.form.reset();
  }
}
