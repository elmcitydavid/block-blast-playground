<script lang="ts">
	let {
		is_bright,
		checked = $bindable(false),
		onchange
	}: { is_bright: boolean; checked: boolean; onchange: EventListener } = $props();
</script>

<label
	class="cursor-pointer rounded-sm bg-slate-800 transition-colors has-[:checked]:bg-rose-500"
	class:brightness-200={is_bright}
>
	<input type="checkbox" class="hidden" bind:checked {onchange} />
</label>
