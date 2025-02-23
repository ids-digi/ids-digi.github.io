

document.addEventListener("DOMContentLoaded", () => {
    const cardContainer = document.getElementById("card-container");
    
        // Sample data for multiple cards
        const bills = RandomData();
        
        // Function to create a card dynamically
        function createCard(bill) {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.billId = bill.id; // Store bill ID for event handling
            card.dataset.category = bill.category;
            card.addEventListener("click", onBillClick);
    
            card.innerHTML = `
                <div class="icon">
                    <span>${bill.type.split(" ")[0]}</span>
                </div>
                <div class="content">
                    <p class="bill-number">• ${bill.type}</p>
                    <div class="title-container">
                        <h3 class="card-title">${bill.title}</h3>
                        <span class="card-status">${bill.status}</span>
                    </div>
                    <p class="card-description">${bill.description}</p>
                    <div class="read-more">
                        <a href="#">Read more on IDS &rarr;</a>
                    </div>
                </div>
            `;
    
            return card;
        }
    
        const filtersContainer = document.querySelector(".filters");
        const paginationContainer = document.getElementById("pagination-container");
        paginationContainer.classList.add("pagination");
        

        let filteredBills = [...bills]; // Store currently displayed bills
        const itemsPerPage = 4; // Number of bills per page
        let currentPage = 1;

        filtersContainer.addEventListener("click", BillsFilterBtn);
        

        function BillsFilterBtn(e) {
            e.preventDefault();

            const billFilter = e.target.value; // Get clicked button's value
            if (!billFilter) return;

            console.log(`Filtering by category: ${billFilter}`);

            // Filter bills based on category
            filteredBills = bills.filter(bill => billFilter === "all" || bill.category === billFilter);

            // Reset pagination
            currentPage = 1;
            displayPaginatedItems();

            // Update active filter button styling
            document.querySelectorAll(".filter-btn").forEach(btn => btn.classList.remove("active"));
            e.target.classList.add("active");
        }

        function displayPaginatedItems() {
            cardContainer.innerHTML = ""; // Clear existing cards
        
            // Calculate start and end indexes for pagination
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const paginatedItems = filteredBills.slice(start, end);
        
            // Append cards for the current page
            paginatedItems.forEach(bill => {
                const cardElement = createCard(bill);
                cardContainer.appendChild(cardElement);
            });
        
            updatePaginationControls();
        }

        function updatePaginationControls() {
            paginationContainer.innerHTML = ""; // Clear previous controls
            const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
        
            // Previous Button
            const prevBtn = document.createElement("button");
            prevBtn.innerText = "Previous";
            prevBtn.disabled = currentPage === 1;
            prevBtn.addEventListener("click", () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayPaginatedItems();
                }
            });
            paginationContainer.appendChild(prevBtn);
        
            // Page Numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement("button");
                pageBtn.innerText = i;
                pageBtn.classList.add("page-btn");
                if (i === currentPage) {
                    pageBtn.classList.add("active");
                }
                pageBtn.addEventListener("click", () => {
                    currentPage = i;
                    displayPaginatedItems();
                });
                paginationContainer.appendChild(pageBtn);
            }
        
            // Next Button
            const nextBtn = document.createElement("button");
            nextBtn.innerText = "Next";
            nextBtn.disabled = currentPage === totalPages;
            nextBtn.addEventListener("click", () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayPaginatedItems();
                }
            });
            paginationContainer.appendChild(nextBtn);
        }

        displayPaginatedItems();
        
    
        // Event handler for bill clicks
        function onBillClick(event) {
            event.preventDefault();
            const billId = event.currentTarget.dataset.billId;
            
            // Remove red border from all cards
            document.querySelectorAll(".card").forEach(card => card.classList.remove("selected-card"));
        
            // Add red border to the clicked card
            event.currentTarget.classList.add("selected-card");
        
            // Find and update the timeline
            const selectedBill = bills.find(bill => bill.id === billId);
            if (selectedBill) {
                updateTimeline({"timelineData":selectedBill.timeline, "billType": selectedBill.type, "billTitle": selectedBill.title});
            }
        }


    
        function updateTimeline(data) {
            console.log(data)
            const timelineList = document.getElementById("timeline-list");
            const timelineContainer = document.querySelector(".timeline");
            const timelineDescription = document.querySelector(".timeline-description");
            timelineDescription.innerHTML = `
            <p class="process-description">${data.billType} - ${data.billTitle}</p>
            
        `;
        
            // Fade out current timeline before updating
            timelineList.classList.add("fade-out");
        
            setTimeout(() => {
                timelineList.innerHTML = ""; // Clear old timeline
        
                let completedCount = 0;
        
                data.timelineData.forEach((item, index) => {
                    const li = document.createElement("li");
                    const iconColor = item.completed ? "#48b918" : "#cccfd1";
        
                    li.classList.add("timeline-item"); // Add transition class
                    li.style.animationDelay = `${index * 0.1}s`; // Staggered effect
        
                    li.innerHTML = `
                        
                        <span class="icon ${item.completed ? '' : 'pending'}">
                            <i class="fa-solid fa-circle-check fa-2xl" style="color: ${iconColor};"></i>
                        </span>
                        <div>
                            <p class="${item.completed ? 'status-completed' : 'pending'}">
                                ${item.status}
                            </p>
                            <small>${item.date}</small>
                        </div>
                    `;
        
                    timelineList.appendChild(li);
        
                    if (item.completed) {
                        completedCount = index + 1;
                    }
                });
        
                // Fade in new timeline
                timelineList.classList.remove("fade-out");
                timelineList.classList.add("fade-in");
        
                // Delay progress bar update until timeline is visible
                setTimeout(() => {
                    const totalItems = data.timelineData.length;
                    const completedHeight = (completedCount / totalItems) * 100;
        
                    timelineContainer.style.setProperty("--completed-height", `${completedHeight}%`);
                }, 400); // Ensure smooth update after animations
        
            }, 300); // Delay clearing old items to match fade-out duration
        }
        
        // Load resources dynamically
        const resources = [
            {
                title: "Workforce Related Program Reviews",
                description: "Analyzes workforce programs to improve employment rates and skill development...",
                link: "#"
            },
            {
                title: "Property Tax Studies",
                description: "A deep dive into the impact of property tax policies on homeowners and businesses...",
                link: "#"
            },
            {
                title: "Tax Expenditure Reports",
                description: "Comprehensive reports on tax revenue, deductions, and governmental expenditures...",
                link: "#"
            },
            {
                title: "How a Bill Becomes a Law",
                description: "Explains the process of how a bill goes through multiple stages before becoming law...",
                link: "#"
            }
        ];
    
        const resourcesContainer = document.getElementById('additional-resources-container');
        resourcesContainer.innerHTML = resources.map(resource => `
            <div class="resource">
                <h3>${resource.title}</h3>
                <p>${resource.description}</p>
                <a href="${resource.link}" class="read-more">Read more on IDS &rarr;</a>
            </div>
        `).join('');
    
    
    });
    



function RandomData(){
    const bills = [
        {
            id: "001",
            type: "SB 1",
            title: "Property Tax Relief",
            status: "Introduced",
            category: "active",
            description: "Adds provisions to authorize a county fiscal body to adopt an ordinance to establish a property tax payment.",
            timeline: [
                { status: "Introduced", date: "Jan 9, 2024", completed: true },
                { status: "House Passed", date: "", completed: false },
                { status: "Senate Passed", date: "", completed: false },
                { status: "Conference", date: "", completed: false },
                { status: "House Again", date: "", completed: false },
                { status: "Senate Again", date: "", completed: false },
                { status: "Signed", date: "", completed: false }
            ]
        },
        {
            id: "002",
            type: "HB 5",
            title: "Education Funding",
            status: "Passed",
            category: "house",
            description: "Allocates additional funds for public schools and teacher salaries.",
            timeline: [
                { status: "Introduced", date: "Jan 9, 2024", completed: true },
                { status: "House Passed", date: "Jan 9, 2024", completed: true },
                { status: "Senate Passed", date: "Jan 9, 2024", completed: true },
                { status: "Conference", date: "", completed: false },
                { status: "House Again", date: "", completed: false },
                { status: "Senate Again", date: "", completed: false },
                { status: "Signed", date: "", completed: false }
            ]
        },
        {
            id: "003",
            type: "SB 12",
            title: "Healthcare Expansion",
            status: "Pending",
            category: "active",
            description: "Expands healthcare access for low-income families through subsidies.",
            timeline: [
                { status: "Introduced", date: "Jan 9, 2024", completed: true },
                { status: "House Passed", date: "", completed: false },
                { status: "Senate Passed", date: "", completed: false },
                { status: "Conference", date: "", completed: false },
                { status: "House Again", date: "", completed: false },
                { status: "Senate Again", date: "", completed: false },
                { status: "Signed", date: "", completed: false }
            ]
        },
        {
            id: "004",
            type: "HB 20",
            title: "Transportation Budget",
            status: "Approved",
            category: "signed",
            description: "Increases funding for road maintenance and public transit projects.",
            timeline: [
                { status: "Introduced", date: "Jan 9, 2024", completed: true },
                { status: "House Passed", date: "Jan 9, 2024", completed: true },
                { status: "Senate Passed", date: "Jan 9, 2024", completed: true },
                { status: "Conference", date: "Jan 10, 2024", completed: true },
                { status: "House Again", date: "Jan 11, 2024", completed: true },
                { status: "Senate Again", date: "Jan 12, 2024", completed: true },
                { status: "Signed", date: "Jan 13, 2024", completed: true }
            ]
        },
        {
            id: "005",
            type: "SB 25",
            title: "Renewable Energy Act",
            status: "Introduced",
            category: "senate",
            description: "Encourages investment in renewable energy projects.",
            timeline: [
                { status: "Introduced", date: "Feb 1, 2024", completed: true },
                { status: "House Passed", date: "", completed: false },
                { status: "Senate Passed", date: "", completed: false },
                { status: "Conference", date: "", completed: false },
                { status: "House Again", date: "", completed: false },
                { status: "Senate Again", date: "", completed: false },
                { status: "Signed", date: "", completed: false }
            ]
        },
        {
            id: "006",
            type: "HB 35",
            title: "Affordable Housing Plan",
            status: "Pending",
            category: "inactive",
            description: "Provides subsidies for affordable housing projects.",
            timeline: [
                { status: "Introduced", date: "Feb 3, 2024", completed: true },
                { status: "House Passed", date: "", completed: false },
                { status: "Senate Passed", date: "", completed: false },
                { status: "Conference", date: "", completed: false },
                { status: "House Again", date: "", completed: false },
                { status: "Senate Again", date: "", completed: false },
                { status: "Signed", date: "", completed: false }
            ]
        },
        {
            id: "007",
            type: "SB 40",
            title: "Cybersecurity Enhancement Act",
            status: "Introduced",
            category: "active",
            description: "Implements new cybersecurity measures for government agencies.",
            timeline: [
                { status: "Introduced", date: "Feb 5, 2024", completed: true },
                { status: "House Passed", date: "", completed: false },
                { status: "Senate Passed", date: "", completed: false },
                { status: "Conference", date: "", completed: false },
                { status: "House Again", date: "", completed: false },
                { status: "Senate Again", date: "", completed: false },
                { status: "Signed", date: "", completed: false }
            ]
        },
        {
            id: "008",
            type: "HB 50",
            title: "Small Business Tax Reduction",
            status: "Pending",
            category: "house",
            description: "Provides tax incentives for small businesses.",
            timeline: [
                { status: "Introduced", date: "Feb 8, 2024", completed: true },
                { status: "House Passed", date: "", completed: false },
                { status: "Senate Passed", date: "", completed: false },
                { status: "Conference", date: "", completed: false },
                { status: "House Again", date: "", completed: false },
                { status: "Senate Again", date: "", completed: false },
                { status: "Signed", date: "", completed: false }
            ]
        },
        {
            id: "009",
            type: "SB 60",
            title: "Education Technology Grants",
            status: "Approved",
            category: "signed",
            description: "Expands funding for education technology in schools.",
            timeline: [
                { status: "Introduced", date: "Feb 10, 2024", completed: true },
                { status: "House Passed", date: "Feb 12, 2024", completed: true },
                { status: "Senate Passed", date: "Feb 14, 2024", completed: true },
                { status: "Conference", date: "Feb 16, 2024", completed: true },
                { status: "House Again", date: "Feb 18, 2024", completed: true },
                { status: "Senate Again", date: "Feb 20, 2024", completed: true },
                { status: "Signed", date: "Feb 22, 2024", completed: true }
            ]
        }
    ];

    return bills;
}