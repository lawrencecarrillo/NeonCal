<script>
        function toggleTask(element) {
            element.classList.toggle('completed');
            
            // Trigger simple sparkle logic
            if(element.classList.contains('completed')) {
                console.log("Task Sparkled!");
                // You can add a library like 'canvas-confetti' here later
            }
        }
    </script>
