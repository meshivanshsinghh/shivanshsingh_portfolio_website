"use server";

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, error: "All fields are required." };
  }

  const accessKey = process.env.WEB3FORMS_KEY;
  if (!accessKey) {
    return { success: false, error: "Contact form is not configured." };
  }

  const payload = new FormData();
  payload.append("access_key", accessKey);
  payload.append("name", name);
  payload.append("email", email);
  payload.append("message", message);
  payload.append("subject", `Portfolio Contact - ${name}`);
  payload.append("from_name", "shivanshsingh.in");

  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: payload,
    });
    const data = await res.json();
    return data.success
      ? { success: true }
      : { success: false, error: "Submission failed. Please try again." };
  } catch {
    return { success: false, error: "Network error. Please try again." };
  }
}
