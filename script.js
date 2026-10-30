// ==============================================================================
// 1. SELEÇÃO DOS ELEMENTOS DO HTML (DOM)
// ==============================================================================
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskRepeat = document.getElementById("task-repeat");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCounter = document.getElementById("task-counter");
const clearCompletedBtn = document.getElementById("clear-completed-btn");
const resetDayBtn = document.getElementById("reset-day-btn");

// ==============================================================================
// 2. ESTADO DA APLICAÇÃO (DADOS SALVOS NO NAVEGADOR)
// ==============================================================================
// Carrega as tarefas existentes do localStorage. Cada tarefa possui:
// { id, text, targetCount (quantas vezes no dia), currentCount (quantas já fez), completed }
let rawTasks = JSON.parse(localStorage.getItem("my_tasks")) || [];

// Garante que tarefas criadas anteriormente tenham os novos campos de repetição
let tasks = rawTasks.map((t) => {
  const target = t.targetCount || 1;
  const current = t.currentCount !== undefined ? t.currentCount : (t.completed ? target : 0);
  return {
    ...t,
    targetCount: target,
    currentCount: current,
    completed: current >= target || t.completed,
  };
});

// ==============================================================================
// 3. FUNÇÕES DE PERSISTÊNCIA E STATUS
// ==============================================================================

/**
 * Salva a lista de tarefas atual no localStorage do navegador.
 */
function saveTasks() {
  localStorage.setItem("my_tasks", JSON.stringify(tasks));
}

/**
 * Atualiza o contador de tarefas e a exibição de botões auxiliares.
 */
function updateStatus() {
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.length - pendingTasks;

  if (tasks.length === 0) {
    taskCounter.textContent = "0 tarefas na rotina";
    resetDayBtn.style.display = "none";
  } else {
    resetDayBtn.style.display = "inline-block";
    if (pendingTasks === 1) {
      taskCounter.textContent = "1 tarefa pendente hoje";
    } else {
      taskCounter.textContent = `${pendingTasks} tarefas pendentes hoje`;
    }
  }

  // Exibe o botão de limpar concluídas somente se houver pelo menos uma concluída
  if (completedTasks > 0) {
    clearCompletedBtn.style.display = "inline-block";
  } else {
    clearCompletedBtn.style.display = "none";
  }
}

// ==============================================================================
// 4. RENDERIZAÇÃO NA TELA
// ==============================================================================

/**
 * Renderiza (desenha) todas as tarefas na tela com suporte a repetições diárias.
 */
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }

  tasks.forEach((task) => {
    const isCompleted = task.completed;
    const target = task.targetCount || 1;
    const current = task.currentCount || 0;

    // Elemento principal do item
    const li = document.createElement("li");
    li.className = `task-item ${isCompleted ? "completed" : ""}`;

    // Área de conteúdo (checkbox + texto + contador de repetição)
    const contentDiv = document.createElement("div");
    contentDiv.className = "task-item-content";

    // Checkbox customizado
    const checkbox = document.createElement("div");
    checkbox.className = "task-checkbox";
    checkbox.setAttribute("title", isCompleted ? "Marcar como pendente" : "Marcar como concluída");
    checkbox.innerHTML = `
      <svg width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="1.5 5.5 4.5 8.5 10.5 1.5"></polyline>
      </svg>
    `;
    // Clicar no checkbox alterna a tarefa entre completa ou pendente
    checkbox.addEventListener("click", () => toggleTask(task.id));
    contentDiv.appendChild(checkbox);

    // Texto da atividade
    const textWrapper = document.createElement("div");
    textWrapper.className = "task-text-wrapper";

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = task.text;
    textWrapper.appendChild(textSpan);

    // Se for uma tarefa repetível (mais de 1 vez ao dia), exibe controle de progresso
    if (target > 1) {
      const progressDiv = document.createElement("div");
      progressDiv.className = "repeat-progress-bar";

      // Botão diminuir contagem (-)
      const minusBtn = document.createElement("button");
      minusBtn.type = "button";
      minusBtn.className = "btn-counter-step";
      minusBtn.textContent = "−";
      minusBtn.setAttribute("title", "Desfazer 1 repetição");
      minusBtn.disabled = current <= 0;
      minusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        stepRepetition(task.id, -1);
      });

      // Texto de contagem (ex: 2/4 feitas hoje)
      const countLabel = document.createElement("span");
      countLabel.className = "counter-label";
      countLabel.textContent = `${current} de ${target} feitas`;

      // Botão aumentar contagem (+)
      const plusBtn = document.createElement("button");
      plusBtn.type = "button";
      plusBtn.className = "btn-counter-step btn-plus";
      plusBtn.textContent = "+";
      plusBtn.setAttribute("title", "Registrar mais 1 repetição hoje");
      plusBtn.disabled = current >= target;
      plusBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        stepRepetition(task.id, +1);
      });

      progressDiv.appendChild(minusBtn);
      progressDiv.appendChild(countLabel);
      progressDiv.appendChild(plusBtn);
      textWrapper.appendChild(progressDiv);
    }

    contentDiv.appendChild(textWrapper);

    // Etiqueta visual de status
    if (isCompleted) {
      const badge = document.createElement("span");
      badge.className = "task-badge";
      badge.textContent = target > 1 ? "Meta do dia concluída!" : "Concluída";
      contentDiv.appendChild(badge);
    } else if (target > 1) {
      const badge = document.createElement("span");
      badge.className = "task-badge-repeat";
      badge.textContent = `${target}x ao dia`;
      contentDiv.appendChild(badge);
    }

    // Botão de excluir
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.setAttribute("title", "Excluir atividade");
    deleteBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
      </svg>
    `;

    deleteBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      deleteTask(task.id);
    });

    li.appendChild(contentDiv);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateStatus();
}

// ==============================================================================
// 5. OPERAÇÕES COM AS TAREFAS
// ==============================================================================

/**
 * Adiciona uma nova atividade com suporte a repetições
 */
function addTask(text, repeatCount) {
  const trimmedText = text.trim();
  if (trimmedText === "") return;

  const target = parseInt(repeatCount, 10) || 1;

  const newTask = {
    id: Date.now(),
    text: trimmedText,
    targetCount: target,
    currentCount: 0,
    completed: false,
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();
}

/**
 * Registra mais uma repetição ou desfaz (ex: bebeu mais um copo d'água)
 */
function stepRepetition(id, delta) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      const newCount = Math.max(0, Math.min(task.targetCount, (task.currentCount || 0) + delta));
      return {
        ...task,
        currentCount: newCount,
        completed: newCount >= task.targetCount,
      };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

/**
 * Alterna diretamente uma tarefa entre concluída ou pendente
 */
function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      const isNowCompleted = !task.completed;
      return {
        ...task,
        completed: isNowCompleted,
        currentCount: isNowCompleted ? task.targetCount : 0,
      };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

/**
 * Exclui uma tarefa específica
 */
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

/**
 * Remove apenas as tarefas concluídas da lista
 */
function clearCompleted() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

/**
 * Reinicia o progresso da rotina para um novo dia:
 * Zera a contagem e desmarca as tarefas, mas mantém sua lista intacta!
 */
function resetDailyRoutine() {
  if (tasks.length === 0) return;

  const confirmReset = confirm(
    "☀️ Deseja reiniciar a sua rotina para o dia de hoje? Suas tarefas serão mantidas, apenas as repetições e conclusões serão zeradas para você recomeçar."
  );

  if (confirmReset) {
    tasks = tasks.map((task) => ({
      ...task,
      currentCount: 0,
      completed: false,
    }));
    saveTasks();
    renderTasks();
  }
}

// ==============================================================================
// 6. EVENT LISTENERS
// ==============================================================================

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  addTask(taskInput.value, taskRepeat.value);
  taskInput.value = "";
  taskRepeat.value = "1"; // Volta para 1 vez como padrão
  taskInput.focus();
});

clearCompletedBtn.addEventListener("click", clearCompleted);
resetDayBtn.addEventListener("click", resetDailyRoutine);

// ==============================================================================
// 7. INICIALIZAÇÃO
// ==============================================================================
renderTasks();
