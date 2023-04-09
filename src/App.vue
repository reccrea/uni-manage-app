<script setup lang="ts"></script>

<template>
	<keep-alive v-if="$route.meta.keepAlive">
		<router-view></router-view>
	</keep-alive>
	<router-view v-else></router-view>
</template>

<style lang="less" scoped></style>
