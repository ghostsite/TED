/*
 *  Copyright 2012 JAXIO http://www.jaxio.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.ted.common.dao.jpa.support;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.domain.Persistable;

/**
 * Helper to create a predicate out of {@link EntitySelector}s.
 */
public class ByEntitySelectorUtil {

	public static <E> Predicate byEntitySelectors(Root<E> root, CriteriaBuilder builder, final List<EntitySelector<?, ? extends Persistable<?>, ?>> selectors) {
		List<Predicate> predicates = new ArrayList<Predicate>();

		for (EntitySelector<?, ? extends Persistable<?>, ?> s : selectors) {
			@SuppressWarnings("unchecked")
			EntitySelector<E, ? extends Persistable<?>, ?> selector = (EntitySelector<E, ? extends Persistable<?>, ?>) s;

			if (selector.isNotEmpty()) {
				List<Predicate> selectorPredicates = new ArrayList<Predicate>();

				for (Persistable<?> selection : selector.getSelected()) {
					if (selector.getField() != null) {
						selectorPredicates.add(builder.equal(root.get(selector.getField()), selection.getId()));
					} else {
						selectorPredicates.add(builder.equal(root.get(selector.getCpkField()).get(selector.getCpkInnerField().getName()), selection.getId()));
					}
				}
				predicates.add(JpaUtil.orPredicate(builder, selectorPredicates));
			}
		}
		return JpaUtil.andPredicate(builder, predicates);
	}
}