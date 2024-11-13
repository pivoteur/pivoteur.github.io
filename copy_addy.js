const copy_addy = addy => {

   // Copy the text inside the text field
  navigator.clipboard.writeText(addy);

  // Alert the copied text
  alert("Copied the text: " + addy);
}
