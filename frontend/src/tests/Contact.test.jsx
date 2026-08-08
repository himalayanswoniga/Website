import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Contact from '../pages/public/Contact';
import { ToastProvider } from '../context/ToastContext';
import ToastContainer from '../components/common/ToastContainer';
import { contactService } from '../services/contactService';
import { settingsService } from '../services/settingsService';

vi.mock('../services/contactService');
vi.mock('../services/settingsService');

function renderContact() {
  return render(
    <MemoryRouter>
      <ToastProvider>
        <Contact />
        <ToastContainer />
      </ToastProvider>
    </MemoryRouter>
  );
}

describe('Contact page', () => {
  it('submits the enquiry form and resets it on success', async () => {
    settingsService.get.mockResolvedValue({
      contactInfo: { address: 'Kathmandu, Nepal', phone: '+977 1234567', email: 'info@example.com', website: '', socialLinks: {} },
    });
    contactService.submit.mockResolvedValue({ _id: '1' });

    renderContact();
    await screen.findByText('Kathmandu, Nepal');

    fireEvent.change(screen.getByPlaceholderText('Your Full Name'), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByPlaceholderText('Email Address'), { target: { value: 'jane@example.com' } });
    fireEvent.change(screen.getByDisplayValue('Type of Enquiry'), { target: { value: 'General Enquiry' } });
    fireEvent.change(screen.getByPlaceholderText('Tell us about your requirements…'), { target: { value: 'Interested in bulk garlic powder.' } });

    fireEvent.click(screen.getByText('Send Enquiry'));

    await waitFor(() => expect(contactService.submit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Jane Doe', email: 'jane@example.com', message: 'Interested in bulk garlic powder.' })
    ));
    await screen.findByText("Enquiry sent — we'll be in touch soon!");
  });
});
