function updateCustomDocsPreview() {
            var container = document.getElementById('custom-docs-preview');
            if (!container) return;
            container.innerHTML = "";
            // Ponudba
            var hasQuote = (typeof window.g_editedQuoteHTML !== 'undefined' && window.g_editedQuoteHTML.trim() !== "");
            var qCard = document.createElement('div');
            qCard.style.width = "70px";
            qCard.style.height = "99px"; // A4 aspect ratio
            qCard.style.border = hasQuote ? "2px solid #10b981" : "1px dashed #64748b";
            qCard.style.background = hasQuote ? "#ecfdf5" : "transparent";
            qCard.style.borderRadius = "4px";
            qCard.style.cursor = "pointer";
            qCard.style.display = "flex";
            qCard.style.flexDirection = "column";
            qCard.style.alignItems = "center";
            qCard.style.justifyContent = "center";
            qCard.style.boxShadow = hasQuote ? "0 4px 6px rgba(0,0,0,0.1)" : "none";
            qCard.style.position = "relative";
            qCard.style.transition = "all 0.2s";
            qCard.title = hasQuote ? "Ponudba (prilagojena) - Klikni za odpiranje" : "Ponudba (avtomatska) - Klikni za odpiranje";
            qCard.onclick = function () { printQuote(); };
            qCard.onmouseover = function () { this.style.transform = "scale(1.05)"; };
            qCard.onmouseout = function () { this.style.transform = "scale(1)"; };
            var qLabel = document.createElement('div');
            qLabel.style.fontSize = "10px";
            qLabel.style.fontWeight = "bold";
            qLabel.style.color = hasQuote ? "#047857" : "#94a3b8";
            qLabel.innerText = "PONUDBA";
            if (hasQuote) {
                var check = document.createElement('div');
                check.innerHTML = "✏️";
                check.style.fontSize = "20px";
                check.style.color = "#10b981";
                qCard.appendChild(check);
            } else {
                var fileIcon = document.createElement('div');
                fileIcon.innerHTML = "??";
                fileIcon.style.fontSize = "20px";
                fileIcon.style.color = "#94a3b8";
                fileIcon.style.opacity = "0.5";
                qCard.appendChild(fileIcon);
            }
            qCard.appendChild(qLabel);
            container.appendChild(qCard);
            // Ponudba AT
            var hasQuoteAT = (typeof window.g_editedQuoteATHTML !== 'undefined' && window.g_editedQuoteATHTML.trim() !== "");
            var qaCard = document.createElement('div');
            qaCard.style.width = "70px";
            qaCard.style.height = "99px";
            qaCard.style.border = hasQuoteAT ? "2px solid #ef4444" : "1px dashed #64748b";
            qaCard.style.background = hasQuoteAT ? "#fef2f2" : "transparent";
            qaCard.style.borderRadius = "4px";
            qaCard.style.cursor = "pointer";
            qaCard.style.display = "flex";
            qaCard.style.flexDirection = "column";
            qaCard.style.alignItems = "center";
            qaCard.style.justifyContent = "center";
            qaCard.style.boxShadow = hasQuoteAT ? "0 4px 6px rgba(0,0,0,0.1)" : "none";
            qaCard.style.position = "relative";
            qaCard.style.transition = "all 0.2s";
            qaCard.title = hasQuoteAT ? "Ponudba AT (prilagojena) - Klikni za odpiranje" : "Ponudba AT (avtomatska) - Klikni za odpiranje";
            qaCard.onclick = function () { printQuoteAT(); };
            qaCard.onmouseover = function () { this.style.transform = "scale(1.05)"; };
            qaCard.onmouseout = function () { this.style.transform = "scale(1)"; };
            var qaLabel = document.createElement('div');
            qaLabel.style.fontSize = "10px";
            qaLabel.style.fontWeight = "bold";
            qaLabel.style.color = hasQuoteAT ? "#b91c1c" : "#94a3b8";
            qaLabel.innerText = "PON. AT";
            if (hasQuoteAT) {
                var checkAT = document.createElement('div');
                checkAT.innerHTML = "✏️";
                checkAT.style.fontSize = "20px";
                checkAT.style.color = "#ef4444";
                qaCard.appendChild(checkAT);
            } else {
                var fileIconAT = document.createElement('div');
                fileIconAT.innerHTML = "??";
                fileIconAT.style.fontSize = "20px";
                fileIconAT.style.color = "#94a3b8";
                fileIconAT.style.opacity = "0.5";
                qaCard.appendChild(fileIconAT);
            }
            qaCard.appendChild(qaLabel);
            container.appendChild(qaCard);
            // Delovni nalog
            var hasDN = (typeof window.g_editedWorkOrderHTML !== 'undefined' && window.g_editedWorkOrderHTML.trim() !== "");
            var dCard = document.createElement('div');
            dCard.style.width = "70px";
            dCard.style.height = "99px";
            dCard.style.border = hasDN ? "2px solid #8b5cf6" : "1px dashed #64748b";
            dCard.style.background = hasDN ? "#f5f3ff" : "transparent";
            dCard.style.borderRadius = "4px";
            dCard.style.cursor = "pointer";
            dCard.style.display = "flex";
            dCard.style.flexDirection = "column";
            dCard.style.alignItems = "center";
            dCard.style.justifyContent = "center";
            dCard.style.boxShadow = hasDN ? "0 4px 6px rgba(0,0,0,0.1)" : "none";
            dCard.style.position = "relative";
            dCard.style.transition = "all 0.2s";
            dCard.title = hasDN ? "Delovni Nalog (prilagojen) - Klikni za odpiranje" : "Delovni Nalog (avtomatski) - Klikni za odpiranje";
            dCard.onclick = function () { printWorkOrder(); };
            dCard.onmouseover = function () { this.style.transform = "scale(1.05)"; };
            dCard.onmouseout = function () { this.style.transform = "scale(1)"; };
            var dLabel = document.createElement('div');
            dLabel.style.fontSize = "10px";
            dLabel.style.fontWeight = "bold";
            dLabel.style.color = hasDN ? "#6d28d9" : "#94a3b8";
            dLabel.innerText = "D. NALOG";
            if (hasDN) {
                var dcheck = document.createElement('div');
                dcheck.innerHTML = "✏️";
                dcheck.style.fontSize = "20px";
                dcheck.style.color = "#8b5cf6";
                dCard.appendChild(dcheck);
            } else {
                var dIcon = document.createElement('div');
                dIcon.innerHTML = "??";
                dIcon.style.fontSize = "20px";
                dIcon.style.color = "#94a3b8";
                dIcon.style.opacity = "0.5";
                dCard.appendChild(dIcon);
            }
            dCard.appendChild(dLabel);
            container.appendChild(dCard);
            
            prevQuoteHTML = window.g_editedQuoteHTML;
            prevQuoteATHTML = window.g_editedQuoteATHTML;
            prevDNHTML = window.g_editedWorkOrderHTML;
        }