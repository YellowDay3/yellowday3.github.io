
function showPage(shown, hidden) {
    document.getElementById(shown).style.display='block';
    document.getElementById(hidden).style.display='none';
    return false;
}

window.onload = function() {
    const page1 = document.getElementById("PageHome");
    const page2 = document.getElementById("PageResevation");
  
    // Check if the Page1 div is hidden
    if (!(window.getComputedStyle(page1).display === "none")) {
    // Ensure the default background is applied
      document.body.classList.remove('blank-bg');
      document.body.classList.add('page1-bg');
    } else {
      // Change the background to a blank color
      document.body.classList.remove('page1-bg');
      document.body.classList.add('blank-bg');
    }
  };
  