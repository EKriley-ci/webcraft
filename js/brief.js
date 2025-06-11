const form = document.querySelector("form.main-content")
const nextBtn = document.getElementById("next")
const prevBtn = document.getElementById("prev")

// Clés pour localStorage
const STORAGE_KEYS = {
  briefData: "webcraft_brief_data",
  currentIndex: "webcraft_current_index",
  uploadedFiles: "webcraft_uploaded_files",
}

// Charger les données sauvegardées
let briefData = loadFromStorage(STORAGE_KEYS.briefData) || {}
let currentIndex = loadFromStorage(STORAGE_KEYS.currentIndex) || 0
let uploadedFiles = loadFromStorage(STORAGE_KEYS.uploadedFiles) || []

// Fonctions de sauvegarde/chargement
function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    console.log(`💾 Données sauvegardées: ${key}`)
  } catch (error) {
    console.error("Erreur sauvegarde:", error)
  }
}

function loadFromStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error("Erreur chargement:", error)
    return null
  }
}

function clearStorage() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key)
  })
  console.log("🗑️ Données effacées")
}

// Sauvegarder automatiquement
function autoSave() {
  saveToStorage(STORAGE_KEYS.briefData, briefData)
  saveToStorage(STORAGE_KEYS.currentIndex, currentIndex)
  saveToStorage(STORAGE_KEYS.uploadedFiles, uploadedFiles)
}

// Fonction globale pour la suppression de fichiers
window.removeFile = (index) => {
  uploadedFiles.splice(index, 1)
  const fileList = form.querySelector(".file-list")
  if (fileList) displayFileList(fileList)
  autoSave()
}

const templates = {
  text: document.getElementById("tpl-text"),
  textarea: document.getElementById("tpl-textarea"),
  multiple: document.getElementById("tpl-multiple"),
  transition: document.getElementById("tpl-transition"),
  "date-split": document.getElementById("tpl-date"),
  file: document.getElementById("tpl-file"),
  end: document.getElementById("tpl-end"),
}

const questions = [
  {
    type: "text",
    name: "nom",
    label: "À qui est-ce qu'on s'adresse ?",
    placeholder: "Votre nom complet ou prénom",
    required: true,
  },
  {
    type: "text",
    name: "projet_nom",
    label: "Comment s'appelle votre projet, votre marque ou votre entreprise ?",
    placeholder: "Même si c'est encore en construction",
    required: true,
  },
  {
    type: "text",
    name: "email",
    label: "Pourriez-vous nous laisser votre adresse email ?",
    placeholder: "exemple@mail.com",
    required: true,
    validation: "email",
  },
  {
    type: "text",
    name: "whatsapp",
    label: "Et votre numéro WhatsApp ?",
    placeholder: "Votre numéro WhatsApp",
    required: true,
    validation: "phone",
  },
  { type: "transition" },
  {
    type: "textarea",
    name: "activite",
    label: "En quelques mots, c'est quoi votre activité ?",
    desc: "Dites-nous simplement ce que vous faites, ou ce que vous voulez lancer.",
    required: true,
  },
  {
    type: "textarea",
    name: "objectif",
    label: "Pourquoi voulez-vous un site ?",
    desc: "Vente en ligne, visibilité, portfolio, autre ?",
    required: true,
  },
  {
    type: "multiple",
    name: "pages",
    label: "Vous imaginez quelles pages sur votre site ?",
    desc: "Cochez ce qui vous semble utile. Vous pouvez sélectionner plusieurs options.",
    options: [
      "Accueil",
      "À propos",
      "Services / Produits",
      "Boutique",
      "Blog",
      "Contact",
      "Témoignages",
      "FAQ",
      "Autre (précisez)",
    ],
  },
  {
    type: "multiple",
    name: "fonctionnalites",
    label: "Fonctionnalités souhaitées",
    desc: "Voici quelques options classiques. Vous pouvez en choisir plusieurs.",
    options: [
      "Formulaire de contact",
      "Paiement en ligne",
      "Réservation",
      "Galerie",
      "Espace membre",
      "Newsletter",
      "Chat",
      "Autre (précisez)",
    ],
  },
  { type: "date-split", name: "delai", label: "Vous voulez que ce soit prêt pour quand ?" },
  {
    type: "textarea",
    name: "precision",
    label: "Une précision à partager ?",
    desc: "Une idée, une référence, un rêve ?",
  },
  { type: "file", name: "fichiers", label: "Des fichiers à joindre ?", desc: "(Logo, maquettes, etc.)" },
]

// Fonctions de validation
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validateIvorianPhone(phone) {
  const cleaned = phone.replace(/\s+/g, "").replace(/[-()]/g, "")
  const patterns = [/^\+225\d{8,10}$/, /^225\d{8,10}$/, /^0\d{8,9}$/]
  return patterns.some((pattern) => pattern.test(cleaned))
}

function formatIvorianPhone(phone) {
  const cleaned = phone.replace(/\s+/g, "").replace(/[-()]/g, "")

  if (cleaned.startsWith("+225")) {
    return cleaned
  } else if (cleaned.startsWith("225")) {
    return "+" + cleaned
  } else if (cleaned.startsWith("0")) {
    return "+225" + cleaned.substring(1)
  } else {
    return "+225" + cleaned
  }
}

function showError(message) {
  const errorDiv = form.querySelector(".error-message")
  if (errorDiv) {
    errorDiv.textContent = message
    errorDiv.style.display = "block"
  } else {
    alert(message)
  }
}

function hideError() {
  const errorDiv = form.querySelector(".error-message")
  if (errorDiv) {
    errorDiv.style.display = "none"
  }
}

function renderStep(index) {
  const q = questions[index]
  form.innerHTML = ""

  if (q.type === "transition") {
    renderTransition()
    return
  }

  const tpl = templates[q.type].content.cloneNode(true)
  const questionElement = tpl.querySelector(".question")

  if (!questionElement) {
    console.error("Template manquant pour le type:", q.type)
    return
  }

  questionElement.textContent = q.label

  const desc = tpl.querySelector(".desc")
  if (desc && q.desc) {
    desc.textContent = q.desc
    desc.classList.remove("hidden")
  }

  if (q.type === "text" || q.type === "textarea") {
    const input = tpl.querySelector(".responseInput")
    if (input) {
      input.placeholder = q.placeholder || ""
      input.value = briefData[q.name] || ""

      const button = tpl.querySelector("button")
      if (button) {
        button.onclick = () => validateAndNext(q, input.value.trim())

        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && q.type === "text") {
            e.preventDefault()
            button.click()
          }
        })

        input.addEventListener("input", () => {
          briefData[q.name] = input.value.trim()
          autoSave()
        })
      }
    }
  } else if (q.type === "multiple") {
    const ul = tpl.querySelector("ul.selections")
    const addPageDiv = tpl.querySelector(".addPage")
    briefData[q.name] = briefData[q.name] || []

    if (ul) {
      q.options.forEach((opt, i) => {
        const btn = document.createElement("button")
        btn.type = "button"
        btn.className = "option"
        btn.innerHTML = `<p class="k-shotcut">${String.fromCharCode(65 + i)}</p>${opt}`

        if (briefData[q.name].includes(opt)) {
          btn.classList.add("selected")
        }

        btn.onclick = (e) => {
          e.preventDefault()
          e.stopImmediatePropagation()

          btn.classList.toggle("selected")
          const selected = briefData[q.name]
          const exists = selected.includes(opt)

          if (exists) {
            briefData[q.name] = selected.filter((x) => x !== opt)
          } else {
            selected.push(opt)
          }

          if (addPageDiv) {
            const hasAutreSelected = briefData[q.name].some((item) => item.includes("Autre"))
            if (hasAutreSelected) {
              addPageDiv.style.display = "block"
            } else {
              addPageDiv.style.display = "none"
              delete briefData[q.name + "_autre"]
            }
          }

          updateSelectionCount(q.name, briefData[q.name].length)
          autoSave()
        }

        ul.appendChild(btn)
      })

      if (addPageDiv && briefData[q.name].some((item) => item.includes("Autre"))) {
        addPageDiv.style.display = "block"
        const autreInput = addPageDiv.querySelector("input")
        if (autreInput && briefData[q.name + "_autre"]) {
          autreInput.value = briefData[q.name + "_autre"]
        }
      }
    }

    if (addPageDiv) {
      const addBtn = addPageDiv.querySelector(".add-custom-btn")
      const customInput = addPageDiv.querySelector("input")

      if (addBtn && customInput) {
        addBtn.onclick = (e) => {
          e.preventDefault()
          e.stopImmediatePropagation()

          const customText = customInput.value.trim()
          if (customText) {
            addCustomOption(q.name, customText, ul, addPageDiv)
          }
        }

        customInput.onkeydown = (e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            addBtn.click()
          }
        }

        customInput.addEventListener("input", () => {
          briefData[q.name + "_autre"] = customInput.value.trim()
          autoSave()
        })
      }
    }

    const selectionIndicator = document.createElement("div")
    selectionIndicator.className = "selection-indicator"
    selectionIndicator.style.marginTop = "10px"
    selectionIndicator.style.color = "#0ACFD4"
    selectionIndicator.style.fontWeight = "bold"
    updateSelectionCount(q.name, briefData[q.name].length, selectionIndicator)

    const continueBtn = tpl.querySelector("button.primary-btn")
    if (continueBtn && continueBtn.parentNode) {
      continueBtn.parentNode.insertBefore(selectionIndicator, continueBtn)
    }

    if (continueBtn) {
      continueBtn.type = "button"
      continueBtn.onclick = (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()

        if (addPageDiv && addPageDiv.style.display === "block") {
          const autreInput = addPageDiv.querySelector("input")
          if (autreInput && autreInput.value.trim()) {
            briefData[q.name + "_autre"] = autreInput.value.trim()
          }
        }

        goNext()
      }
    }
  } else if (q.type === "date-split") {
    const jourInput = tpl.querySelector("#jour")
    const moisInput = tpl.querySelector("#mois")
    const anneeInput = tpl.querySelector("#annee")

    if (briefData[q.name]) {
      const [jour, mois, annee] = briefData[q.name].split("/")
      if (jourInput) jourInput.value = jour
      if (moisInput) moisInput.value = mois
      if (anneeInput) anneeInput.value = annee
    }

    const button = tpl.querySelector("button")
    if (button) {
      button.onclick = () => {
        if (!jourInput || !moisInput || !anneeInput) {
          showError("Erreur: éléments de date non trouvés")
          return
        }

        const jour = jourInput.value
        const mois = moisInput.value
        const annee = anneeInput.value

        if (!jour || !mois || !annee) {
          showError("Veuillez remplir tous les champs de date")
          return
        }

        const jourNum = Number.parseInt(jour)
        const moisNum = Number.parseInt(mois)
        const anneeNum = Number.parseInt(annee)

        if (jourNum < 1 || jourNum > 31) {
          showError("Le jour doit être entre 1 et 31")
          return
        }

        if (moisNum < 1 || moisNum > 12) {
          showError("Le mois doit être entre 1 et 12")
          return
        }

        if (anneeNum < 2024) {
          showError("L'année doit être 2024 ou plus")
          return
        }

        const dateTest = new Date(anneeNum, moisNum - 1, jourNum)
        if (dateTest.getDate() !== jourNum) {
          showError("Cette date n'existe pas")
          return
        }

        const jourStr = jourNum.toString().padStart(2, "0")
        const moisStr = moisNum.toString().padStart(2, "0")

        briefData[q.name] = `${jourStr}/${moisStr}/${annee}`
        hideError()
        autoSave()
        goNext()
      }

      if (jourInput) jourInput.addEventListener("input", () => autoSave())
      if (moisInput) moisInput.addEventListener("input", () => autoSave())
      if (anneeInput) anneeInput.addEventListener("input", () => autoSave())
    }
  } else if (q.type === "file") {
    const fileInput = tpl.querySelector("#fileInput")
    const fileList = tpl.querySelector(".file-list")

    if (fileInput && fileList) {
      displayFileList(fileList)

      fileInput.addEventListener("change", (e) => {
        uploadedFiles = Array.from(e.target.files)
        displayFileList(fileList)
        autoSave()
      })

      const button = tpl.querySelector("button")
      if (button) {
        button.onclick = () => {
          briefData[q.name] = uploadedFiles.map((f) => f.name)
          autoSave()
          goNext()
        }
      }
    }
  }

  form.appendChild(tpl)
  updateNav()
}

function updateSelectionCount(fieldName, count, element = null) {
  const indicator = element || form.querySelector(".selection-indicator")
  if (indicator) {
    if (count === 0) {
      indicator.textContent = "Aucune sélection"
      indicator.style.color = "#999"
    } else if (count === 1) {
      indicator.textContent = "1 option sélectionnée"
      indicator.style.color = "#0ACFD4"
    } else {
      indicator.textContent = `${count} options sélectionnées`
      indicator.style.color = "#0ACFD4"
    }
  }
}

function addCustomOption(questionName, customText, ul, addPageDiv) {
  if (!customText.trim()) return

  if (!briefData[questionName]) {
    briefData[questionName] = []
  }

  const customOption = `Autre: ${customText.trim()}`
  if (!briefData[questionName].includes(customOption)) {
    briefData[questionName].push(customOption)
  }

  const customBtn = document.createElement("button")
  customBtn.type = "button"
  customBtn.className = "option selected"
  customBtn.innerHTML = `<p class="k-shotcut">+</p>${customOption}`

  customBtn.onclick = (e) => {
    e.preventDefault()
    e.stopImmediatePropagation()

    customBtn.classList.toggle("selected")
    const selected = briefData[questionName]
    const exists = selected.includes(customOption)

    if (exists) {
      briefData[questionName] = selected.filter((x) => x !== customOption)
      customBtn.remove()
    }

    updateSelectionCount(questionName, briefData[questionName].length)
    autoSave()
  }

  ul.appendChild(customBtn)

  const input = addPageDiv.querySelector("input")
  if (input) {
    input.value = ""
  }

  updateSelectionCount(questionName, briefData[questionName].length)
  autoSave()
}

function renderTransition() {
  const tpl = templates.transition.content.cloneNode(true)
  const button = tpl.querySelector("button")
  if (button) {
    button.onclick = () => goNext()
  }
  form.appendChild(tpl)
  updateNav()
}

function displayFileList(container) {
  container.innerHTML = ""
  uploadedFiles.forEach((file, index) => {
    const fileName = file.name || file
    const fileDiv = document.createElement("div")
    fileDiv.innerHTML = `
      <span>${fileName}</span>
      <button type="button" onclick="removeFile(${index})" style="margin-left: 10px; color: #F71B75;">✕</button>
    `
    container.appendChild(fileDiv)
  })
}

function validateAndNext(question, value) {
  hideError()

  if (question.required && !value) {
    showError("Ce champ est obligatoire")
    return
  }

  if (question.validation === "email" && value && !validateEmail(value)) {
    showError("Veuillez entrer une adresse email valide")
    return
  }

  if (question.validation === "phone" && value && !validateIvorianPhone(value)) {
    showError("Veuillez entrer un numéro de téléphone ivoirien valide (ex: +225 XX XX XX XX)")
    return
  }

  if (question.validation === "phone" && value) {
    value = formatIvorianPhone(value)
  }

  briefData[question.name] = value
  autoSave()
  goNext()
}

function goNext() {
  if (currentIndex < questions.length - 1) {
    currentIndex++
    autoSave()
    renderStep(currentIndex)
  } else {
    showEndScreen()
  }
}

function goPrev() {
  if (currentIndex > 0) {
    currentIndex--
    autoSave()
    renderStep(currentIndex)
  }
}

function updateNav() {
  prevBtn.style.display = currentIndex > 0 ? "inline-block" : "none"
  nextBtn.style.display = "none"
}

prevBtn.addEventListener("click", goPrev)

// Écran de fin
function showEndScreen() {
  form.innerHTML = ""
  const tpl = templates.end.content.cloneNode(true)
  const clientNameSpan = tpl.querySelector("#client_name")
  if (clientNameSpan) {
    clientNameSpan.textContent = briefData.nom || "client"
  }

  const downloadBtn = tpl.querySelector("#downloadBrief")
  if (downloadBtn) {
    downloadBtn.onclick = () => {
      try {
        console.log("📄 Génération du PDF...")
        const pdf = generatePDF(briefData)
        pdf.save(`brief-${briefData.nom || "client"}.pdf`)
        console.log("✅ PDF téléchargé avec succès")
      } catch (error) {
        console.error("❌ Erreur génération PDF:", error)
        alert("Erreur lors de la génération du PDF. Veuillez réessayer.")
      }
    }
  }

  const sendBtn = tpl.querySelector("#sendBrief")
  if (sendBtn) {
    sendBtn.onclick = async () => {
      const loadingDiv = tpl.querySelector(".loading")

      if (loadingDiv) {
        loadingDiv.style.display = "block"
        loadingDiv.innerHTML = "<p>📧 Envoi du brief en cours...</p>"
      }

      try {
        console.log("🚀 === DÉBUT PROCESSUS D'ENVOI ===")
        console.log("📊 Données du brief:", briefData)

        // Préparer les données pour l'envoi
        const formData = new FormData()
        formData.append("briefData", JSON.stringify(briefData))

        // Envoyer via PHP
        console.log("📧 Tentative d'envoi email...")
        const response = await fetch("php/send-brief.php", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (result.success) {
          console.log("🎉 Email envoyé avec succès!")
          if (loadingDiv) {
            loadingDiv.innerHTML = `
              <p style='color: #0ACFD4; font-weight: bold;'>
                ✅ Brief envoyé avec succès !
              </p>
              <p style='color: #666; font-size: 0.9em; margin-top: 10px;'>
                📧 Email envoyé à agencewabcraft@gmail.com
              </p>
            `
          }

          // Envoyer notification WhatsApp
          console.log("📱 Envoi notification WhatsApp...")
          sendWhatsAppNotification()

          // Effacer les données après succès
          setTimeout(() => {
            clearStorage()
            console.log("🎉 Formulaire terminé avec succès!")
          }, 3000)
        } else {
          throw new Error(result.message || "Erreur serveur")
        }
      } catch (error) {
        console.error("❌ === ERREUR PROCESSUS D'ENVOI ===")
        console.error("❌ Erreur détaillée:", error)

        if (loadingDiv) {
          loadingDiv.innerHTML = `
            <p style='color: #F71B75; font-weight: bold;'>
              ❌ Erreur lors de l'envoi
            </p>
            <p style='color: #666; font-size: 0.9em; margin-top: 10px;'>
              ${error.message || "Erreur inconnue"}
            </p>
            <button onclick="location.reload()" style="margin-top: 10px; padding: 5px 10px; background: #0ACFD4; color: white; border: none; border-radius: 3px; cursor: pointer;">
              🔄 Réessayer
            </button>
          `
        }

        // Même en cas d'erreur, proposer l'envoi WhatsApp
        console.log("📱 Tentative d'envoi WhatsApp malgré l'erreur...")
        sendWhatsAppNotification()
      }
    }
  }

  form.appendChild(tpl)
  nextBtn.style.display = "none"
  prevBtn.style.display = "none"
}

// Fonction pour envoyer une notification WhatsApp
function sendWhatsAppNotification() {
  try {
    console.log("📱 Envoi de notification WhatsApp...")

    const whatsappSummary = `
🚀 *NOUVEAU BRIEF CLIENT COMPLET* 🚀

═══════════════════════════════
📋 *INFORMATIONS CLIENT*
═══════════════════════════════

👤 *Client :* ${briefData.nom || "Non fourni"}
🏢 *Projet/Entreprise :* ${briefData.projet_nom || "Non fourni"}
📧 *Email :* ${briefData.email || "Non fourni"}
📱 *WhatsApp :* ${briefData.whatsapp || "Non fourni"}

═══════════════════════════════
🎯 *DÉTAILS DU PROJET*
═══════════════════════════════

🏭 *Activité :*
${briefData.activite || "Non précisé"}

🎯 *Objectif du site :*
${briefData.objectif || "Non précisé"}

📄 *Pages souhaitées :*
${
  Array.isArray(briefData.pages)
    ? briefData.pages.length > 0
      ? briefData.pages.map((page) => `• ${page}`).join("\n")
      : "• Aucune page spécifiée"
    : "Non précisé"
}
${briefData.pages_autre ? `\n• Autre : ${briefData.pages_autre}` : ""}

⚙️ *Fonctionnalités souhaitées :*
${
  Array.isArray(briefData.fonctionnalites)
    ? briefData.fonctionnalites.length > 0
      ? briefData.fonctionnalites.map((func) => `• ${func}`).join("\n")
      : "• Aucune fonctionnalité spécifiée"
    : "Non précisé"
}
${briefData.fonctionnalites_autre ? `\n• Autre : ${briefData.fonctionnalites_autre}` : ""}

⏰ *Délai souhaité :*
${briefData.delai || "Non précisé"}

💭 *Précisions supplémentaires :*
${briefData.precision || "Aucune précision"}

📎 *Fichiers joints :*
${
  Array.isArray(briefData.fichiers)
    ? briefData.fichiers.length > 0
      ? briefData.fichiers.map((file) => `• ${file}`).join("\n")
      : "• Aucun fichier joint"
    : "Aucun fichier"
}

═══════════════════════════════
📊 *INFORMATIONS SYSTÈME*
═══════════════════════════════

📅 *Date de réception :* ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}
💻 *Envoyé depuis :* Système de brief Webcraft

💼 *Le brief complet a également été envoyé par email à agencewabcraft@gmail.com*
    `.trim()

    const whatsappLink = `https://wa.me/22509465688?text=${encodeURIComponent(whatsappSummary)}`
    window.open(whatsappLink, "_blank")

    console.log("📱 Notification WhatsApp envoyée avec succès")
    return true
  } catch (error) {
    console.error("❌ Erreur lors de l'envoi WhatsApp:", error)
    return false
  }
}

// Génération PDF
function generatePDF(data) {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()

  let y = 20
  const lineHeight = 7
  const pageHeight = doc.internal.pageSize.height

  // En-tête
  doc.setFontSize(18)
  doc.setFont(undefined, "bold")
  doc.text("BRIEF WEBCRAFT", 20, y)
  y += 15

  doc.setFontSize(12)
  doc.setFont(undefined, "normal")
  doc.text(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, 20, y)
  y += 15

  // Ligne de séparation
  doc.line(20, y, 190, y)
  y += 10

  // Contenu
  doc.setFontSize(10)

  const sections = {
    "INFORMATIONS CLIENT": ["nom", "projet_nom", "email", "whatsapp"],
    PROJET: ["activite", "objectif", "pages", "fonctionnalites"],
    PLANNING: ["delai"],
    "DÉTAILS SUPPLÉMENTAIRES": ["precision", "fichiers"],
  }

  for (const [sectionTitle, fields] of Object.entries(sections)) {
    // Titre de section
    doc.setFont(undefined, "bold")
    doc.text(sectionTitle, 20, y)
    y += lineHeight

    doc.setFont(undefined, "normal")

    fields.forEach((field) => {
      if (data[field]) {
        const label = getFieldLabel(field)
        let value = data[field]

        // Gestion spéciale pour les tableaux
        if (Array.isArray(value)) {
          value = value.join(", ")
        }

        // Ajouter les précisions "autre"
        if (data[field + "_autre"]) {
          value += ` (Autre: ${data[field + "_autre"]})`
        }

        // Gestion du texte long
        const splitText = doc.splitTextToSize(`${label}: ${value}`, 170)

        // Vérification de l'espace restant
        if (y + splitText.length * lineHeight > pageHeight - 20) {
          doc.addPage()
          y = 20
        }

        doc.text(splitText, 20, y)
        y += splitText.length * lineHeight + 3
      }
    })

    y += 5 // Espace entre sections
  }

  return doc
}

function getFieldLabel(field) {
  const labels = {
    nom: "Nom",
    projet_nom: "Nom du projet",
    email: "Email",
    whatsapp: "WhatsApp",
    activite: "Activité",
    objectif: "Objectif du site",
    pages: "Pages souhaitées",
    fonctionnalites: "Fonctionnalités",
    delai: "Délai souhaité",
    precision: "Précisions",
    fichiers: "Fichiers joints",
  }
  return labels[field] || field
}

// Afficher un message de récupération si des données existent
function showRecoveryMessage() {
  if (Object.keys(briefData).length > 0 || currentIndex > 0) {
    const message = `
      🔄 Données récupérées ! Vous étiez à la question ${currentIndex + 1}.
      Voulez-vous continuer où vous vous êtes arrêté ?
    `

    if (confirm(message)) {
      console.log("📂 Récupération des données:", briefData)
      renderStep(currentIndex)
    } else {
      briefData = {}
      currentIndex = 0
      uploadedFiles = []
      clearStorage()
      renderStep(currentIndex)
    }
  } else {
    renderStep(currentIndex)
  }
}

// Initialisation
console.log("🚀 Initialisation du formulaire...")
showRecoveryMessage()

// Gestion globale des erreurs
window.addEventListener("error", (e) => {
  console.error("❌ Erreur globale:", e.error)
})

// Sauvegarder avant fermeture de page
window.addEventListener("beforeunload", (e) => {
  autoSave()
  if (Object.keys(briefData).length > 0 && currentIndex < questions.length - 1) {
    e.preventDefault()
    e.returnValue = "Vos données seront sauvegardées. Êtes-vous sûr de vouloir quitter ?"
  }
})
