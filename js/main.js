function sendEmail(email, name, body) {
    var URL = 
        "https://docs.google.com/forms/d/e/1FAIpQLSfBN1Ba0Cq6_5BGk0P-D2srJgPUddKezJt70l_tOosZ9yfeaQ/viewform?usp=pp_url&entry.841021454="+email+
            "&entry.1064810423="+name+
            "&entry.1219012013="+body;

    window.open(URL, '_blank');
}